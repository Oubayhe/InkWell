import React from 'react'
import LoadingPostCard from '../components/loading_components/LoadingPostCard'

const LoadingHomePage = () => {

    const loadingPostCards = []
    for (let i = 0; i < 6; i++) {
        loadingPostCards.push(<LoadingPostCard key={i} />)
    }

  return (
    <div className='px-14'>
        <h1 className='text-2xl font-bold'>Latest Articles</h1>
        <div className="my-4 flex justify-center items-center flex-wrap gap-4">
            {loadingPostCards}
        </div>
    </div>
  )
}

export default LoadingHomePage
