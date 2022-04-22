type Size = "small" | "big";
type Extra = "frosting" | "box" | "nuts";

export type Cake = {
  size: Size;
  extras?: Extra[];
};
