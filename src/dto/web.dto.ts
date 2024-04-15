export class WebResponse<T> {
  message: string;
  data?: T;
  errors?: string;
}
