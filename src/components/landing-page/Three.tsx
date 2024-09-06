import Maskot from '../ThreeModel/Maskot';

export default function Home() {
  return (
   <div className='flex flex-row justify-between items-center w-full'>
     <div style={{ height: '50vh' }} className=' px-40'>
      <Maskot />
    </div>
    <div>
        Hello
    </div>
   </div>
  );
}
