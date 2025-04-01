import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Donation, DonationDocument } from "../schemas/donation.schema";
import { CreateDonationDto } from "src/dtos/create-donation.dto";
import { UpdateDonationDto } from "src/dtos/update-donation.dto";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class DonationService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private configService: ConfigService
  ) {
    const stripeKey = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set in .env");

    this.stripe = new Stripe(stripeKey, {
      apiVersion: "2025-02-24.acacia",
    });
  }

  async create(createDonationDto: CreateDonationDto): Promise<Donation> {
    const donation = new this.donationModel(createDonationDto);
    return donation.save();
  }

  async findAll(): Promise<Donation[]> {
    return this.donationModel.find().exec();
  }

  async findById(id: string): Promise<Donation> {
    const donation = await this.donationModel.findById(id).exec();
    if (!donation) throw new NotFoundException("Donation not found");
    return donation;
  }

  async update(
    id: string,
    updateDonationDto: UpdateDonationDto
  ): Promise<Donation> {
    const updateDonation = await this.donationModel
      .findByIdAndUpdate(id, updateDonationDto, { new: true })
      .exec();

    if (!updateDonation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }

    return updateDonation;
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.donationModel.findByIdAndDelete(id);
    return { message: "Donation deleted successfully" };
  }

  async createCheckoutSession(amount: number) {
    try {
      const transactionId = `stripe_${Date.now()}`;

      const donation = await new this.donationModel({
        donorName: "Anonymous",
        amount,
        transactionId,
        paymentMethod: "stripe",
        timestamp: new Date(),
        status: "pending",
      }).save();

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Donation to Muslim Noor" },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "https://yourfrontend.com/donation-success",
        cancel_url: "https://yourfrontend.com/donation-cancel",
        metadata: {
          donationId: donation._id.toString(), // ✅ Stripe metadata requires string
        },
      });

      return { url: session.url };
    } catch (error) {
      Logger.error("Error creating Stripe checkout session", error);
      throw error;
    }
  }

  async handleStripeWebhook(event: Stripe.Event) {
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const donationId = session.metadata?.donationId;

        if (donationId) {
          await this.donationModel.findByIdAndUpdate(donationId, {
            status: "confirmed",
          });
        }
      }
    } catch (error) {
      Logger.error("Error handling Stripe webhook event", error);
      throw error;
    }
  }

  constructStripeEvent(
    rawBody: Buffer,
    signature: string,
    secret: string
  ): Stripe.Event {
    try {
    console.log("here are some details", signature, secret);
      return this.stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      throw new Error("Webhook signature verification failed");
    }
  }

  async updateDonationStatus(
    paymentIntentId: string,
    status: "succeeded" | "failed"
  ): Promise<void> {
    try {
      await this.donationModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        { status },
        { new: true }
      );
    } catch (err) {
      console.error("Error updating donation status:", err);
      throw new InternalServerErrorException(
        "Failed to update donation status"
      );
    }
  }
}
