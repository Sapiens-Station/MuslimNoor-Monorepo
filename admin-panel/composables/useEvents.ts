export interface Event {
    _id?: string
    title: string
    description: string
    date: string
    imageUrl?: string
  }
  
  export function useEvents() {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || '/api'
  
    const fetchEvents = async () => {
      const { data, error } = await useFetch<Event[]>(`${apiBase}/events`)
      if (error.value) throw new Error('Failed to fetch events')
      return data.value || []
    }
  
    const fetchEventById = async (id: string) => {
      const { data, error } = await useFetch<Event>(`${apiBase}/events/${id}`)
      if (error.value) throw new Error('Event not found')
      return data.value
    }
  
    const createEvent = async (eventData: Event) => {
      const { data, error } = await useFetch(`${apiBase}/events`, {
        method: 'POST',
        body: eventData
      })
      if (error.value) throw new Error('Failed to create event')
      return data.value
    }
  
    const updateEvent = async (id: string, eventData: Event) => {
      const { data, error } = await useFetch(`${apiBase}/events/${id}`, {
        method: 'PUT',
        body: eventData
      })
      if (error.value) throw new Error('Failed to update event')
      return data.value
    }
  
    const deleteEvent = async (id: string) => {
      const { error } = await useFetch(`${apiBase}/events/${id}`, {
        method: 'DELETE'
      })
      if (error.value) throw new Error('Failed to delete event')
    }
  
    return {
      fetchEvents,
      fetchEventById,
      createEvent,
      updateEvent,
      deleteEvent
    }
  }
  