export class EntityProfileAttribute {
  constructor(
    public key: string,
    public contentType: string,
    public contentEncoding: string,
    public value: string
  ) {}
}

export class EntityProfile {
  constructor(
    public entityId: { identifier: string },
    public attributes: Array<EntityProfileAttribute>
  ) {}
}