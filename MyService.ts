import MyOtherService from "./MyOtherService";

export default class MyService {
    private readonly myOtherService: MyOtherService;

    constructor(myOtherService: MyOtherService) {
        this.myOtherService = myOtherService;
    }

    public async getImportantNumber(): Promise<number> {
        const number = await this.myOtherService.getImportantNumber();
        return number * 2;
    }

    public async myAction(): Promise<void> {
        await this.myOtherService.myOtherAction();
    }
}