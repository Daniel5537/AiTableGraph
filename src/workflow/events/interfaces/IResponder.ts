export interface IResponder {
    result(data: object): void;
    fault(info: object): void;
}