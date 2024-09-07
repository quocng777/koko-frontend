import { useMemo, useState } from 'react'
import { Conservation, ConservationType, Participant } from '../../app/api/conservation/conservation-type'
import { useSelector } from 'react-redux'
import { getCurrentAuthentication } from '../../app/api/auth/auth-slice'
import { Avatar } from '../../components/avatar'
import { Button } from '../../components/buttons/button'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6'

type ConservationInfoProps = {
    conservation: Conservation,
} 

export const ConservationInfo = ({ conservation } : ConservationInfoProps) => {

  return (
    <div className=' my-8 bg-background rounded-2xl py-2 px-4 min-w-32 w-full'>
        Conservation info

        <div className='my-4 flex flex-col items-center w-full'>
            <Avatar src={conservation.avatar} />
            <p className='text-lg font-semibold'>{conservation.name}</p>
        </div>

        {conservation.type == ConservationType.GROUP && 
            <ConservationMembers conservation={conservation} />}
        
    </div>
  )
}


type ConservationMembersProps = {
    conservation: Conservation
}

const ConservationMembers = ( { conservation }: ConservationMembersProps ) => {
    const [ showMembers, setShowMembers ] = useState(false); 

    const handleShowMemberClick = () => {
        setShowMembers(prev => {
            return !prev
        });
    };

    return (
        <div className='w-full bg-slate-200 px-2 py-2 rounded-xl text-slate-700'>
            <div className='flex items-center'>
                <span className='font-medium'>Members</span>
                <Button variant='ghost' size='icon' className='ml-auto' onClick={handleShowMemberClick}>
                    {
                        showMembers 
                            ? <FaAngleUp />
                            : <FaAngleDown />
                    }
                </Button>
            </div>
            { showMembers && <div className='flex flex-col gap-2 mt-3'>
                {
                    conservation
                        .participants
                        .map((participant) => {
                            return (
                                <div key={participant.userId} className='flex items-center'>
                                    <Avatar src={participant.userAvatar} size='xs' />
                                    <p className='text-sm font-semibold mx-4'>{participant.name}</p>
                                    <span className="text-sky-400 text-sm font-semibold">@{participant.username}</span>
            
                                        {/* <div className="ml-auto flex items-center gap-4">
                                            <Button className="flex-grow-0 py-2">
                                                Message
                                            </Button>
                                            <Button variant="ghost" size="icon" >
                                                <BsThreeDotsVertical />
                                            </Button>
                                        </div> */}
                                </div>
                            )
                        })
                }
            </div>}
        </div>
    )
}
