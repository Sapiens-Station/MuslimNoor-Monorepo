import type { EventCreateDTO, EventUpdateDTO, EventModel } from '~/interfaces/event.interface';

export function useEvents() {
  const { $axios } = useNuxtApp();

  const fetchEvents = async (): Promise<EventModel[]> => {
    const res = await $axios.get('/events');
    return res.data as EventModel[];
  };

  const fetchEventById = async (id: string): Promise<EventModel> => {
    const res = await $axios.get(`/events/${id}`);
    return res.data as EventModel;
  };

  const createEvent = async (payload: EventCreateDTO): Promise<EventModel> => {
    const res = await $axios.post('/events', payload);
    return res.data as EventModel;
  };

  // Backend accepts partial (PUT or PATCH). Keeping PUT for now.
  const updateEvent = async (id: string, payload: EventUpdateDTO): Promise<EventModel> => {
    const res = await $axios.put(`/events/${id}`, payload);
    return res.data as EventModel;
  };

  const deleteEvent = async (id: string): Promise<void> => {
    await $axios.delete(`/events/${id}`);
  };

  return { fetchEvents, fetchEventById, createEvent, updateEvent, deleteEvent };
}

