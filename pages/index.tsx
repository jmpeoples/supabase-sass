import type { NextPage } from 'next'

import { supabase } from "../utils/supabase";

const Home: NextPage = (lessons) => {
 

  
  let learning = Object.values(lessons);
  let newLearning = learning.flatMap((learn) => learn);

  console.log("learing",  newLearning);
 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {newLearning.map((lesson:any) => (
        <p key={lesson.id}>{lesson.title}</p>
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*');

  return {
    props: {
      lessons
    }
  }
}

export default Home
