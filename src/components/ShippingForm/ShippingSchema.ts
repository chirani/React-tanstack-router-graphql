import { z } from 'zod';

export const shippingSchema = z.object({
  name: z.string().min(5, 'Name is required'),
  address: z.string().min(9, 'Address is required'),
  email: z.email('Invalid email'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
