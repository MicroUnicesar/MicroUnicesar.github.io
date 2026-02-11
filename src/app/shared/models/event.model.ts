export interface Event {
  id?: number,
  title: string,
  date: string,
  time: string,
  type: string,
  description: string,
  location: string,
  registration_link?: string,
  more_info?: string
}
