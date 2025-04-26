import { DomainException } from "@/errors/domain/index";

export default class InconsistentColumnDataDomainException extends DomainException {
  public readonly context: Record<string, unknown>;

  constructor(params: { message?: string; context?: Record<string, unknown> }) {
    super(params?.message || "Inconsistent Column Data domain exception");

    this.context = params?.context || {};
  }
}
