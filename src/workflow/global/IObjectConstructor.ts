export interface IObjectConstructor {
    new <T>(...args: any): T;
    say(): void;
}