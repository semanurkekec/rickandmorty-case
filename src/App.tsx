import { Suspense, useDeferredValue, useState } from 'react'
import './App.css'
import CharacterList from './CharacterList'
import { useGetCharacters } from './service/api'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
const [query,setQuery]=useState<string>()
const deferred = useDeferredValue(query)
  return <QueryClientProvider client={queryClient}>
            <input type="search" value={query} onChange={(e)=>setQuery(e.target.value)}  name='q'/>

<ListView searchQuery={deferred} />
  </QueryClientProvider>

}

export default App

export function ListView(props:{searchQuery?:string}){

  const query= useGetCharacters(props.searchQuery)
  if(query.isLoading || query.isPending){
    return <span>loading...</span>
  }if(query.isError){
    return <span>{query.error.message}</span>
  }
  const {results}=query.data
    return (
      <div>
     <Suspense fallback='searching...'><CharacterList characters={results} highlight={props.searchQuery} /></Suspense>
      </div>
    )
}