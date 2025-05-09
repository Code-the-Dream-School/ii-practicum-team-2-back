import { DomainException } from "@/errors/domain/index";

export default class ForeignKeyConstraintDomainException extends DomainException {
  public readonly context: Record<string, unknown>;

  constructor(params: { message?: string; context?: Record<string, unknown> }) {
    super(params?.message || "Foreign key constraint domain exception");

    this.context = params?.context || {};
  }
}
