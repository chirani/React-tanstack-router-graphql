import { useState } from 'react';
import { shippingSchema, type ShippingFormData } from './ShippingSchema';
import { useShippingStore } from '../../zustand/shippingAddress';
import { useNavigate } from '@tanstack/react-router';

export default function ShippingForm() {
  const navigate = useNavigate();
  const { setShipping, shipping } = useShippingStore();

  const [formData, setFormData] = useState<ShippingFormData>({
    ...shipping,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = shippingSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setShipping(result.data);
    navigate({ to: '/' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-96 flex flex-col gap-3"
    >
      <input
        className="input"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <span className="error">{errors.name}</span>}

      <input
        className="input"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      {errors.address && <span className="error">{errors.address}</span>}

      <input
        className="input"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <button className="btn" type="submit">
        Save Shipping
      </button>
    </form>
  );
}
