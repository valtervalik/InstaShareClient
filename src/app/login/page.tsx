import LoginForm from '@/components/login/LoginForm';

const LoginPage = () => {
  return (
    <>
      <section className='flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
        <LoginForm />
      </section>
    </>
  );
};

export default LoginPage;
