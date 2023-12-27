import { useState } from "react";
import { Character } from "./interfaces";

export default function CharacterList(props:{characters:Character[];highlight?:string}){
    return <div>
        <ul>
{props.characters.map(CharacterItem)}
    </ul></div>
}

function CharacterItem(props:Character){
    const {id,episode=[],image,name}=props
    return <li key={id + name}><div><img src={image} alt={name} /><div><span>{name}</span><span>{episode.length}</span></div></div></li>
}