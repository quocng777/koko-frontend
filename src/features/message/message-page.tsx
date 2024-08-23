import { useSelector } from 'react-redux'
import { Conservation } from '../../app/api/conservation/conservation-type'
import ChatBox from './chat-box'
import InboxDrawer from './inbox-drawer'
import { RootState } from '../../app/api/store'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLazyGetConservationQuery } from '../../app/api/conservation/conservation-api-slice'
import { getCurrentAuthentication } from '../../app/api/auth/auth-slice'
export const MessagePage = () => {

    const navigate = useNavigate();

    let { consId } = useParams();
    const cachedId =localStorage.getItem("cachedConservation") ?? undefined;
    if(!consId && cachedId) {
      consId = cachedId;
      navigate(`/messages/${consId}`)
    }
    const [ conservation, setConservation ] = useState<null | Conservation>(null);
    const conservations = useSelector((state: RootState) => state.conservation);
    const [ getConservation ] = useLazyGetConservationQuery();
    const [ showStart, setShowStart ] = useState(false);
    const user = useSelector(getCurrentAuthentication);

    if(consId === 'new') {
      // handle later
    }

    useEffect(() => {
      if(Number(consId)) {
        const constIdNum = Number(consId);
        if(!conservation) {
          getConservation(constIdNum)
            .unwrap()
            .then(res => {
              if(res.data && !conservation) {
                const cons = res.data;
                setConservation(cons);
                localStorage.setItem("cachedConservation", cons.id.toString());
                setShowStart(false);
              }
          })
          .catch((err) => {
          })
        }
      } else if (consId == 'start') {
        setShowStart(true);
      } else {
        if(conservations && conservations.length > 0) {
          console.log(consId)
          navigate(`/messages/${conservations![conservations.length - 1].id.toString()}`, {replace: true})
          setConservation(conservations![conservations.length - 1])
        } else {
          setShowStart(true);
        }
      }
    }, [ conservations, conservation ]);

    useEffect(() => {
      if(conservation && !conservation.name) {
        const recipient = conservation.participants.find(par => par.userId != user.id);
        setConservation(() => ({
          ...conservation,
          name: recipient?.name,
          avatar: recipient?.userAvatar,
        }))
      }
    }, [ conservation, user ]);

    const handleSelectedInboxChange = (conservation: Conservation) => {
      setConservation(conservation);
      localStorage.setItem("cachedConservation", conservation.id.toString())
      navigate(`/messages/${conservation.id}`);
    }

  return (
    <div className='flex w-full'>
        <InboxDrawer selected={conservation?.id} onChange={handleSelectedInboxChange} />
        {showStart && <p>New conservation</p>}
        {conservation && <ChatBox key={conservation?.id} conservation={conservation}/>}
    </div>
  )
}