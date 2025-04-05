import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  Logger,
} from '@nestjs/common'
import { CreateDonationDto } from '../../dtos/create-donation.dto'
import { UpdateDonationDto } from '../../dtos/update-donation.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'
import { DonationService } from '../services/donation.service'
import { Request, Response } from 'express'
import Stripe from 'stripe'

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationService.create(createDonationDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.donationService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationService.findById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto
  ) {
    return this.donationService.update(id, updateDonationDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.donationService.delete(id)
  }

  // ✅ New route to create Stripe Checkout and save to DB
  @Post('checkout')
  async createStripeCheckout(@Body('amount') amount: number) {
    return this.donationService.createCheckoutSession(amount)
  }

  @Post('webhook')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const rawBody = (req as any).rawBody

    const signature = Array.isArray(req.headers['stripe-signature'])
      ? req.headers['stripe-signature'][0]
      : req.headers['stripe-signature']

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!signature || !endpointSecret || !rawBody) {
      return res
        .status(400)
        .send('Missing raw body, signature, or webhook secret')
    }

    let event: Stripe.Event
    try {
      console.log('here are some details', signature, endpointSecret)
      event = this.donationService.constructStripeEvent(
        rawBody,
        signature,
        endpointSecret
      )
    } catch (err) {
      console.error('❌ Stripe webhook verification failed:', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent
    if (event.type === 'payment_intent.succeeded') {
      await this.donationService.updateDonationStatus(
        paymentIntent.id,
        'succeeded'
      )
    }

    return res.status(200).json({ received: true })
  }
}
