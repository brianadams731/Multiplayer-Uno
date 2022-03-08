import { exampleFunction } from "./example";

test("This is an example description",()=>{
    expect(exampleFunction(10)).toEqual({
        exampleArg: 10,
        otherData: "other example data"
    })
})