import {atom, selector} from "recoil";
export const CounterAtom = atom(
    {
        key: "count",
        default: 0
    }
);

export const EvenColor = selector({
    key: "evenSelector",
    get: function({get}) {
        const count = get(CounterAtom);
        if( count % 2 == 0 ){
            return "bg-red";
        } else {
            return "bg-gray-100";
        }
    }
})