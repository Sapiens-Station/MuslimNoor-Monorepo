import type { EventInterface } from "~/interfaces/event.interface"

// export function useEvents() {
  
//   const { $axios } = useNuxtApp()
//   const config = useRuntimeConfig()
//   const apiBase = config.public.apiBase || '/api'

// const fetchEvents = async () => {
//   const { data, error } = await useFetch<(EventInterface & { _id: string })[]>(`${apiBase}/events`)
//   if (error.value) throw new Error('Failed to fetch events')
//   return data.value || []
// }

//   const fetchEventById = async (id: string) => {
//     const { data, error } = await useFetch<EventInterface>(`${apiBase}/events/${id}`)
//     if (error.value) throw new Error('Event not found')
//     return data.value
//   }

//   const createEvent = async (eventData: EventInterface) => {
//     const { data, error } = await useFetch(`${apiBase}/events`, {
//       method: 'POST',
//       body: eventData,
//     })
//     if (error.value) throw new Error('Failed to create event')
//     return data.value
//   }

//   const updateEvent = async (id: string, eventData: EventInterface) => {
//     const { data, error } = await useFetch(`${apiBase}/events/${id}`, {
//       method: 'PUT',
//       body: eventData,
//     })
//     if (error.value) throw new Error('Failed to update event')
//     return data.value
//   }

//   const deleteEvent = async (id: string) => {
//     const { error } = await useFetch(`${apiBase}/events/${id}`, {
//       method: 'DELETE',
//     })
//     if (error.value) throw new Error('Failed to delete event')
//   }

//   return {
//     fetchEvents,
//     fetchEventById,
//     createEvent,
//     updateEvent,
//     deleteEvent,
//   }
// }


export function useEvents() {
  const { $axios } = useNuxtApp()

  const fetchEvents = async () => {
    const res = await $axios.get('/events')
    return res.data
  }

  const fetchEventById = async (id: string) => {
    const res = await $axios.get(`/events/${id}`)
    return res.data
  }

  const createEvent = async (eventData: EventInterface) => {
    const res = await $axios.post('/events', eventData)
    return res.data
  }

  const updateEvent = async (id: string, eventData: EventInterface) => {
    const res = await $axios.put(`/events/${id}`, eventData)
    return res.data
  }

  const deleteEvent = async (id: string) => {
    await $axios.delete(`/events/${id}`)
  }

  return {
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  }
}
