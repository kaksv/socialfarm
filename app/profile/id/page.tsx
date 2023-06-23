'use client'

import {useState, useEffect} from 'react'
import { usePathname } from 'next/navigation'
import { client, getPublications, getProfile } from '../../../api'

export default function Profile() {
    // Create initial state to hold user profile and array of Publications

    const [profile, setProfile] = useState<any>()
    const [publications, setPublications] = useState<any>([])

    //Using the route, we can use the lens handle to get the handle from the route path.
    const pathName = usePathname();
    const handle  = pathName?.split('/')[2]

    useEffect(() =>{
        if(handle) {
            fetchProfile()
        }
    }, [handle])
    async function fetchProfile(){
            try {
                // Fetch the userProfile using their handle
                const returnedProfile = await client.query({
                    query: getProfile,
                    variables: { handle }
                })
                const profileData = { ...returnedProfile.data.profile}
                //Format their picture if it is not in the right format
                const picture = profileData.picture
                if(picture && picture.original && picture.original.url) {
                    if(picture.original.url.startsWith('ipfs://')) {
                    let result = picture.original.url.substring(7, picture.original.url.length)
                    profileData.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
                } else {
                    profileData.avatarUrl = profileData.picture.original.url
                }
                }

                setProfile(profileData)
                // Fetch the user's Publications from the Lens Api
                const pubs  = await client.query({
                    query: getPublications,
                    variables: {
                        id: profileData.id, limit: 50
                    }
                })
                setPublications(pubs.data.publications.items)
            } catch( err ) {
                console.log('error fethcing publications', err)

            }
    }
    if(!profile) return null
    return (
        <div className='pt-20'>
            <div className='flex flex-col justify-center items-center'>
                <img 
                   className='w-64 rounded-full'
                   src={profile.avatarUrl}
                 />
                 <p className='text-4xl mt-8 mb-8'>{profile.handle}</p>
                 <p className='text-center text-xl font-bold mt-2 mb-2 w-1/2'>{profile.bio}</p>
                 {
                    publications.map(pub =>(
                        <div key={pub.id} className='shadow p-10 rounded mb-8 w-2/3'>
                            <p>{pub.metadat.content}</p>
                        </div>
                    ))
                 }
            </div>
        </div>
    );
}