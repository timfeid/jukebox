import { AiFillDislike, AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { AiOutlineDislike } from 'react-icons/ai'
import { useUserContext } from '../context/user.context'

export default function SongCardWithVoting ({title, artist, albumArt, album, upvotes = [], downvotes = [], className = undefined}) {
  const user = useUserContext()

  return (
    <div className={`flex ${className}`}>
      <div className="flex-shrink-0" style={{width: 60, height: 60}}>
        <img src={albumArt} width="60" height="60" />
      </div>
      <div>
        <div className="flex flex-col justify-center px-4">
          <div className="text-blue-100 font-light leading-5 whitespace-pre-line">
            {artist} - {title}
          </div>
          <div className="text-gray-500 font-light text-sm leading-5">
            {album}
          </div>
        </div>
      </div>
      <div className="ml-auto my-auto flex flex-col">
        <button className="vote-button">
          {(upvotes.includes(user.state.mac) ? <AiFillLike size="24" /> : <AiOutlineLike size="24" />)} {upvotes.length}
        </button>
        <button className="vote-button">
          {(downvotes.includes(user.state.mac) ? <AiFillDislike size="24" /> : <AiOutlineDislike size="24" />)} {downvotes.length}
        </button>
      </div>
    </div>
  )
}
