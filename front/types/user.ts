export type User = {
  id: number | string;
  name: string | null;
  surname: string | null;
  father_name: string | null;
  age: number | string | null;
  city: string | null;
  street: string | null;
  house_number: number | string | null;
  postal_code: string | null;
};

export function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;
  const isNullableString = (field: unknown) =>
    field === null || typeof field === "string";

  return (
    (typeof user.id === "number" || typeof user.id === "string") &&
    isNullableString(user.name) &&
    isNullableString(user.surname) &&
    isNullableString(user.father_name) &&
    (user.age === null ||
      typeof user.age === "number" ||
      typeof user.age === "string") &&
    isNullableString(user.city) &&
    isNullableString(user.street) &&
    (user.house_number === null ||
      typeof user.house_number === "string" ||
      typeof user.house_number === "number") &&
    isNullableString(user.postal_code)
  );
}
