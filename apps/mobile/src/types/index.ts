export type Undefined<Type> = Type | undefined

export type Nullable<Type> = Type | null

export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key]
}
