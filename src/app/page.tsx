export default function HomePage() {
  return (
    <section className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <h1 className='font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient text-9xl'>
          InstaShare
        </h1>
        <p className='text-lg'>Save and organize your data in the cloud</p>
      </div>
    </section>
  );
}
