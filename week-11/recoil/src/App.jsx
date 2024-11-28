import './App.css'
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { CounterAtom, EvenColor } from './store/atoms/Counter';

function Increase() {
  const setCount = useSetRecoilState(CounterAtom);
  return(
    <div>
      <button onClick={() => {
        setCount(count => count+1)
      }}>Increase</button>
    </div>
  )
}

function Decrease() {
  const setCount = useSetRecoilState(CounterAtom);
  return(
    <div>
      <button onClick={() => {
        setCount(count => count-1)
      }}>Decrease</button>
    </div>
  )
}

function Value() {
  const count = useRecoilValue(CounterAtom);
  return(
    <div>
      <p>Count: {count}</p>
    </div>
  )
}

function Color() {
  const color = useRecoilValue(EvenColor);
  return(
    <div>{color}</div>
  )
}

function App() {


  return (
    <>
      <RecoilRoot>
        <Color/>
        <Value />
        <Increase />
        <Decrease />
      </RecoilRoot>
    </>
  )
}

export default App
