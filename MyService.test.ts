import MyOtherService from "./MyOtherService";
import MyService from "./MyService";
import {EqualMatchingInjectorConfig, IMock, Mock, RejectedPromiseFactory, ResolvedPromiseFactory} from "moq.ts";
import {ReturnsAsyncPresetFactory, ThrowsAsyncPresetFactory, MimicsResolvedAsyncPresetFactory, MimicsRejectedAsyncPresetFactory, RootMockProvider, Presets} from "moq.ts/internal";

// Removing the options-override fixes the problem
Mock.options = {
    injectorConfig: new EqualMatchingInjectorConfig([], [
        {
            provide: ReturnsAsyncPresetFactory,
            useClass: MimicsResolvedAsyncPresetFactory,
            deps: [RootMockProvider, Presets, ResolvedPromiseFactory]
        },
        {
            provide: ThrowsAsyncPresetFactory,
            useClass: MimicsRejectedAsyncPresetFactory,
            deps: [RootMockProvider, Presets, RejectedPromiseFactory]
        },
    ])
};

let myOtherService: IMock<MyOtherService>;
let myService: MyService;
beforeEach(() => {
    myOtherService = new Mock<MyOtherService>()
        .prototypeof(MyOtherService.prototype)
        .setup(async x => x.getImportantNumber()).returnsAsync(21);

    myService = new MyService(myOtherService.object());
});

test("test getting important number", async () => {
    const number = await myService.getImportantNumber();
    expect(number).toBe(42);
});

test("verify that other service has been called", async () => {
    await myService.myAction();
    myOtherService.verify(async x => x.myOtherAction());
});