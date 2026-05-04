import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   CHARACTERS
───────────────────────────────────────────────────────────────────────── */
const VOICE_IDS = [
  { id:"VR6AewLTigWG4xSOukaG", label:"Arnold — grave, masculin" },
  { id:"21m00Tcm4TlvDq8ikWAM", label:"Rachel — claire, féminine" },
  { id:"ErXwobaYiN019PkySvjV", label:"Antoni — posé, masculin" },
  { id:"TxGEqnHWrfWFTfGW9XjX", label:"Josh — jeune, masculin" },
  { id:"AZnzlk1XvdvUeBnXmlld", label:"Domi — dynamique, féminine" },
  { id:"EXAVITQu4vr4xnSDxMaL", label:"Bella — douce, féminine" },
  { id:"pNInz4obpgDQGcFmaJgB", label:"Adam — profond, masculin" },
];

const GK_CHARACTERS = [
  { id:"A", name:"Peter",  color:"#b03a2e", bg:"#fdf2f0", voiceId:"VR6AewLTigWG4xSOukaG", stability:0.55, similarity:0.80, style:0.20 },
  { id:"B", name:"Lisa",   color:"#1a5276", bg:"#eaf2f8", voiceId:"21m00Tcm4TlvDq8ikWAM", stability:0.65, similarity:0.85, style:0.15 },
  { id:"C", name:"Bob",    color:"#6c3483", bg:"#f5eef8", voiceId:"ErXwobaYiN019PkySvjV", stability:0.75, similarity:0.75, style:0.05 },
  { id:"D", name:"John",   color:"#1e8449", bg:"#eafaf1", voiceId:"TxGEqnHWrfWFTfGW9XjX", stability:0.50, similarity:0.80, style:0.25 },
  { id:"E", name:"Tracy",  color:"#b7770d", bg:"#fef9e7", voiceId:"AZnzlk1XvdvUeBnXmlld", stability:0.45, similarity:0.85, style:0.35 },
];

const DEFAULT_CHARACTERS = [
  { id:"A", name:"Personnage A", color:"#b03a2e", bg:"#fdf2f0", voiceId:"VR6AewLTigWG4xSOukaG", stability:0.55, similarity:0.80, style:0.20 },
  { id:"B", name:"Personnage B", color:"#1a5276", bg:"#eaf2f8", voiceId:"21m00Tcm4TlvDq8ikWAM", stability:0.65, similarity:0.85, style:0.15 },
  { id:"C", name:"Personnage C", color:"#6c3483", bg:"#f5eef8", voiceId:"ErXwobaYiN019PkySvjV", stability:0.75, similarity:0.75, style:0.05 },
  { id:"D", name:"Personnage D", color:"#1e8449", bg:"#eafaf1", voiceId:"TxGEqnHWrfWFTfGW9XjX", stability:0.50, similarity:0.80, style:0.25 },
  { id:"E", name:"Personnage E", color:"#b7770d", bg:"#fef9e7", voiceId:"AZnzlk1XvdvUeBnXmlld", stability:0.45, similarity:0.85, style:0.35 },
];

const GK_SCRIPT = [
  {id:1,ch:"B",text:"Le temps est écoulé. Je vous écoute. Peter, tu commences ?"},
  {id:2,ch:"A",text:"Un homme est ligoté à une chaise. Il a un sac en tissu sur la tête. Ses vêtements sont déchirés et couverts de poussière et de sang. Un homme en treillis, cagoulé, entre dans le champ de la caméra, s'approche de l'homme et retire le sac. On découvre que le visage de l'homme ligoté est en sang. L'homme en treillis disparaît un instant du champ de la caméra et revient avec un couteau électrique. Il le met en marche et découpe l'oreille de l'homme qui s'évanouit sous la douleur."},
  {id:3,ch:"B",text:"Très bien. Tracy, à toi ?"},
  {id:4,ch:"E",text:"Un homme d'une quarantaine d'années entre dans une chambre d'hôtel, il s'assoit sur le lit et allume la télévision, il zappe entre plusieurs programmes quand soudain il tombe sur une vidéo de lui-même dans la même chambre d'hôtel en train de tuer quelqu'un."},
  {id:5,ch:"B",text:"Bob..."},
  {id:6,ch:"C",text:"Un homme pleure devant le corps d'une femme. Elle est belle. Joli visage. Joliment maquillé. Mais du sang coule tout autour d'elle. Et l'homme qui pleure devant le corps de la femme tient un couteau."},
  {id:7,ch:"B",text:"Très bien, merci. Et maintenant, après l'image principale, je voudrais la log line de votre histoire."},
  {id:8,ch:"A",text:"George Kaplan, un ancien militaire condamné pour acte de torture, est rappelé par les autorités pour infiltrer un réseau terroriste qui a mis la main sur un stock d'armes chimiques. Pour sauver la population de la menace de ces armes, il va devoir utiliser les mêmes méthodes qui lui ont valu son renvoi de l'armée."},
  {id:9,ch:"E",text:"Un homme ordinaire, pris par mégarde pour un certain George Kaplan, se retrouve embarqué malgré lui dans une sombre affaire d'espionnage et, accusé à tort d'un meurtre, doit tout faire pour prouver son innocence."},
  {id:10,ch:"C",text:"Dans les années cinquante, à Hollywood, George Kaplan, un scénariste renommé, devient un serial killer qui sévit dans le milieu du cinéma, après avoir été injustement abandonné par la femme à laquelle il a consacré toute une partie de sa vie."},
  {id:11,ch:"B",text:"Ce n'est rien, Bob, ça va aller. Nous sommes là. Mais, Bob, un conseil. Essaie de sortir un peu de ce genre de proposition, de ligne thématique. Je pense que ce serait mieux pour toi."},
  {id:12,ch:"D",text:"On m'a dit de venir ici."},
  {id:13,ch:"B",text:"Vous êtes John, c'est ça ? C'est ici. Entrez. Laissez-moi vous présenter John. John Turner. John rejoint notre équipe."},
  {id:14,ch:"D",text:"Bonjour."},
  {id:15,ch:"B",text:"Je vous présente les autres membres de l'équipe."},
  {id:16,ch:"A",text:"La dream team."},
  {id:17,ch:"B",text:"Je vous présente Peter Greenwood qui est — dont l'inspiration est très large, mais qui est plutôt spécialisé dans les films, comment dire, les films de guerre, non Peter, on peut dire ça ?"},
  {id:18,ch:"A",text:"Oui, si on veut, même si je préfère parler de « fiction militaire ». J'ai une certaine connaissance du terrain, j'ai servi plusieurs années sous les drapeaux. Enchanté."},
  {id:19,ch:"B",text:"Tracy. Tracy Stanfield, qui est une grande spécialiste de l'écriture scénaristique. Elle a publié plusieurs ouvrages de référence dont vous devez inévitablement avoir entendu parler : Les 10 Commandements du scénario. Comme écrire votre blockbuster."},
  {id:20,ch:"E",text:"Créer des personnages inoubliables. 24 étapes pour construire son histoire. Bonjour."},
  {id:21,ch:"B",text:"Et voici Bob. Bob est notre meilleur dialoguiste comique. Je voulais vous prévenir. La femme de Bob l'a quitté et Bob a du mal à s'en remettre. Les répliques de Bob sont nettement moins drôles ces jours-ci, mais nous vous demandons tout de même de rire aux répliques de Bob, même si ce n'est pas très drôle, pour ne pas le démoraliser, ne pas, comment dire, vous voyez, aggraver la situation, la dépression de Bob."},
  {id:22,ch:"D",text:"Je vois."},
  {id:23,ch:"B",text:"C'est un peu délicat, vous comprenez ?"},
  {id:24,ch:"D",text:"Très bien. Et vous ?"},
  {id:25,ch:"B",text:"Moi ?"},
  {id:26,ch:"D",text:"Vous. Vous ne vous êtes pas présentée. Votre rôle. Ça ne m'a pas été très clairement expliqué..."},
  {id:27,ch:"B",text:"Je suis — Je ne me suis pas présentée, pardon. Lisa Stevens, vous pouvez m'appeler Lisa, je suis là pour — Je coordonne. On ne vous a pas expliqué ? Je coordonne."},
  {id:28,ch:"A",text:"La chef. C'est la chef. On l'appelle « chef »."},
  {id:29,ch:"B",text:"Peter plaisante, je ne suis pas — il n'y a pas de chef. Simplement, j'établis les bases de la réflexion en fonction des demandes des clients. Je connais les clients."},
  {id:30,ch:"D",text:"Vous connaissez les clients ?"},
  {id:31,ch:"B",text:"Je connais les clients."},
  {id:32,ch:"E",text:"Et vous, vous êtes ?"},
  {id:33,ch:"D",text:"Vous ne me connaissez pas ?"},
  {id:34,ch:"E",text:"Pardon, nous devrions ? Jamais entendu parler de vous. Dans le milieu, je veux dire, je ne vois pas, quel film..."},
  {id:35,ch:"D",text:"National Book Award. C'est que j'ai reçu le National Book Award l'année dernière."},
  {id:36,ch:"A",text:"Et, qu'est-ce que vous faites là ?"},
  {id:37,ch:"B",text:"Une demande des clients."},
  {id:38,ch:"D",text:"Les meilleurs m'a-t-on dit, ils voulaient les meilleurs. Je me suis dit..."},
  {id:39,ch:"E",text:"Vous avez pris le chèque, comme nous."},
  {id:40,ch:"D",text:"Une expérience à faire, je me suis dit —"},
  {id:41,ch:"A",text:"Nous avons tous pris le chèque."},
  {id:42,ch:"B",text:"Le cadre ? L'idée ? On vous a un peu expliqué ?"},
  {id:43,ch:"D",text:"Une série, c'est ça ? On m'a parlé d'une série, c'est tout. Je n'y connais pas grand-chose. Ou peut-être un film, tout simplement ?"},
  {id:44,ch:"B",text:"Une série. Un film. Peu importe. Une histoire. Un concept d'histoire. Pour l'instant nous réfléchissons de manière assez ouverte. Un esprit large, c'est ce dont nous avons besoin, John. Un esprit d'équipe, mais le collectif ne doit pas brider les imaginaires. Sans aller jusqu'à parler d'une compétition, nous pensons qu'une émulation est nécessaire pour tirer le meilleur parti de vos imaginaires respectifs."},
  {id:45,ch:"B",text:"Par commodité, un dispositif de micros a été intégré à cette pièce. Toutes les conversations qui ont lieu ici sont enregistrées et transmises directement aux clients. Ils vous payent assez cher, ils partent donc du principe que tout ce que vous inventerez entre ces murs est leur propriété."},
  {id:46,ch:"E",text:"Mais, si vous n'y connaissez rien, il va falloir — il faudrait qu'on vous explique un peu certaines choses, non ? Certaines règles."},
  {id:47,ch:"B",text:"Je crois — Ce qui intéresse les clients, Tracy, c'est justement son regard neuf, le point de vue original qu'il pourra apporter."},
  {id:48,ch:"E",text:"D'accord, mais un peu de pédagogie ne peut pas faire de mal. L'avantage des dix commandements que j'ai mis au point, John, c'est qu'ils sont très facilement compréhensibles par les non-initiés. Alors, écoutez bien. Premier commandement : Captiver et maintenir l'attention du spectateur. Commandement numéro deux : Mobiliser des émotions simples comme la peur, la solitude, le besoin de protection."},
  {id:49,ch:"B",text:"Tracy ! Je suis désolée, mais nous n'avons pas vraiment le temps de passer en revue tous tes commandements, nous n'avons pas que ça à faire."},
  {id:50,ch:"E",text:"Alors, juste un dernier."},
  {id:51,ch:"B",text:"Tracy..."},
  {id:52,ch:"E",text:"Un dernier commandement, le plus important, John. Ne jamais construire une histoire en trois parties. Vous m'entendez, John ? Jamais en trois parties."},
  {id:53,ch:"D",text:"Pourquoi ?"},
  {id:54,ch:"E",text:"Parce qu'une histoire est un organisme vivant, et qu'on ne saurait en aucun cas la réduire à un début, un milieu et une fin, comme l'a fait cet abruti d'Aristote dans sa Poétique. Toute histoire est un organisme complexe et sa structure est une épine dorsale constituée de vingt-quatre vertèbres dont les principales sont : faiblesses morales, besoin moral, confrontation finale, révélation morale, décision morale."},
  {id:55,ch:"D",text:"Pardon ?"},
  {id:56,ch:"E",text:"Tout héros, John, doit suivre un développement moral qui constitue la ligne thématique..."},
  {id:57,ch:"B",text:"Tracy, nous avons un cahier des charges et..."},
  {id:58,ch:"E",text:"Attends, trente secondes. Donc, tout héros, John, doit suivre un développement moral qui constitue la ligne thématique du film ou de l'épisode de la série."},
  {id:59,ch:"D",text:"Je ne suis vraiment pas sûr de vous suivre."},
  {id:60,ch:"E",text:"Au commencement, le héros présente des faiblesses morales, il a donc un besoin moral, c'est-à-dire qu'il doit surmonter ses faiblesses et doit apprendre à agir correctement envers les autres pour évoluer et améliorer sa vie. Son développement moral se termine par une révélation morale qui est la conséquence d'une confrontation finale, cette révélation morale aboutissant à une décision morale."},
  {id:61,ch:"D",text:"Le héros doit évoluer et améliorer sa vie ?"},
  {id:62,ch:"A",text:"Oui, c'est comme ça que ça se passe, dans la vie les gens luttent pour améliorer leur existence, John. C'est comme ça. Le héros est un être imparfait qui va se surpasser, surmonter les obstacles, pour triompher à la fin."},
  {id:63,ch:"B",text:"Tracy, je ne crois pas que ce soit un bon exemple."},
  {id:64,ch:"E",text:"Un homme, donc, dépressif et plein de rancœur — faiblesses morales — doit surmonter son amertume vis-à-vis de la femme qui l'a quittée, retrouver goût à la vie et foi en l'amour — besoin moral. Dans une ultime confrontation avec son ex-femme, il réalise que la vie lui réserve encore de nombreuses joies — révélation morale —, il décide de sortir de sa dépression et d'aller inviter la jolie fleuriste du coin de la rue à prendre un verre."},
  {id:65,ch:"C",text:"Ce n'est pas la mauvaise personne. Je sais que c'est la bonne. La seule et unique personne."},
  {id:66,ch:"B",text:"Bob, c'est une histoire, ce n'est qu'une histoire..."},
  {id:67,ch:"C",text:"Elle l'a toujours été, elle le sera toujours. La vie est terrible. Aucune cohérence. Pas de structure. Pas de putain de structure, Tracy. Tu m'entends ? La vie n'a pas de putain de colonne vertébrale !"},
  {id:68,ch:"E",text:"Je voulais seulement que vous compreniez qu'ici, John, nous n'avons droit ni à l'erreur ni à la médiocrité."},
  {id:69,ch:"B",text:"Merci, Tracy. Passons maintenant à un nouvel exercice : il s'agit d'imaginer un plan pour justifier l'entrée en guerre d'un pays contre un autre. Peter, tu commences ?"},
  {id:70,ch:"A",text:"Afin d'asseoir ses intérêts économiques et géostratégiques dans une région du globe, un gouvernement cherche à faire chuter le régime dictatorial d'un pays, pour cela il favorise l'apparition d'un soulèvement populaire."},
  {id:71,ch:"B",text:"Pas d'intervention armée."},
  {id:72,ch:"A",text:"Non, pas d'intervention armée. On incite la population à la révolte. On attise les colères et les ressentiments à l'égard du régime. Il faut imaginer des insurrections réprimées violemment par l'armée, plusieurs morts, peut-être un massacre de masse. Et puis on souffle sur les braises..."},
  {id:73,ch:"B",text:"Et dans ce scénario, qui est George Kaplan ?"},
  {id:74,ch:"A",text:"George Kaplan pourrait être le directeur des services secrets ou un agent infiltré chargé de manipuler les mouvements d'opposition."},
  {id:75,ch:"B",text:"Très bien. Tracy, à toi..."},
  {id:76,ch:"E",text:"Ça pourrait commencer par l'assassinat d'un ancien Président. Un homme qui reçoit une balle à travers une vitre et qui s'effondre."},
  {id:77,ch:"E",text:"Dans le silence et le calme de l'appartement, le corps qui s'effondre. Et de nouveau le silence, un silence rempli de terreur. Et puis un cri, le cri déchirant de l'épouse de l'ancien Président."},
  {id:78,ch:"E",text:"Des gens haut placés dans l'administration gouvernementale. Ou alors une cellule spéciale. Ou quelque chose de plus obscur. Une sorte de gouvernement invisible."},
  {id:79,ch:"B",text:"Très bien. Merci, Tracy. À toi Bob, une proposition..."},
  {id:80,ch:"C",text:"Des hauts dirigeants des services secrets fomentent un complot pour enlever le Président et le remplacer par un sosie, un certain George Kaplan. Celui-ci doit leur servir à entrer en guerre contre un pays ennemi, ce à quoi le véritable Président s'opposait."},
  {id:81,ch:"B",text:"Très bien Bob, ça ira, merci. L'idée du sosie, très bien, une très bonne idée. John, à vous ?"},
  {id:82,ch:"D",text:"Ça pourrait commencer avec une femme dans le désert. Le soleil qui cogne. Aucune ombre à l'horizon. Une femme seule... avec une poule."},
  {id:83,ch:"D",text:"Et la femme tient un fusil et elle met en joue la poule. Elle n'arrive pas à se décider à tirer et ça dure longtemps. Mais elle ne tire pas, mais elle ne renonce pas à tirer non plus, elle garde son arme braquée sur la poule."},
  {id:84,ch:"D",text:"Parce que d'un côté, elle doit tuer la poule, c'est son contrat. Mais de l'autre côté, elle ne peut pas se résoudre à tuer la poule, parce que la poule peut sauver le monde."},
  {id:85,ch:"B",text:"George Kaplan est une arme. Je n'y avais pas pensé. C'est ingénieux."},
  {id:86,ch:"E",text:"Un film, John, doit se construire à partir d'événements qui soient vraisemblables. Le récit, la structure narrative, étant alors une métaphore de cette vérité."},
  {id:87,ch:"D",text:"Je crois qu'il faut en finir avec les métaphores, Tracy. Il faut en finir avec ces putains de métaphores."},
  {id:88,ch:"E",text:"John, vous savez pourquoi nous sommes là ? Nous sommes là pour apporter des réponses à cette question : Comment un être humain doit-il mener sa vie ? C'est vers les histoires que les gens se tournent, pour trouver un sens à leur vie, pour organiser le chaos de leur existence."},
  {id:89,ch:"B",text:"Écoutez, nous avons un cahier des charges à respecter, je veux maintenant que chacun d'entre vous élabore une ligne narrative dans laquelle George Kaplan est une menace. Allez, Peter..."},
  {id:90,ch:"A",text:"Une organisation secrète décide de profiter de l'apparition d'une menace intérieure représentée par un terroriste qui se fait appeler George Kaplan pour pouvoir faire passer une série de lois sécuritaires."},
  {id:91,ch:"D",text:"Un groupe d'activistes invente une identité fictive nommée George Kaplan. Cette identité, adoptée par de plus en plus d'individus à travers le monde, devient alors un phénomène global qui commence à menacer l'équilibre économique et politique mondial."},
  {id:92,ch:"C",text:"George Kaplan est un homme ordinaire, un père de famille. Un monsieur Tout-le-monde. Il a une femme, des enfants, un travail. Et comme tout homme ordinaire, il a des problèmes."},
  {id:93,ch:"C",text:"Il a des problèmes avec son travail, avec ses enfants, avec ses crédits... et un jour sa femme le quitte et alors George ne comprend pas... et il trouve sa vie inutile et un jour il finit par prendre une arme et il sort dans la rue et il tire sur tout ce qui bouge et... et puis il se tire une balle dans la tête."},
  {id:94,ch:"B",text:"Merci Bob, vraiment, merci. Il y a beaucoup trop d'hommes abandonnés et de meurtres de masse dans tes histoires, ce n'est pas bon, ça, Bob, pas bon du tout."},
  {id:95,ch:"C",text:"Nous devions partir en voyage. Le voyage de noces que nous n'avions jamais eu. Mais lorsque je suis rentré, il n'y avait que ses bagages dans le vestibule. La différence entre la réalité et la fiction, c'est que la fiction doit être cohérente."},
  {id:96,ch:"C",text:"Et puis elle me répond : « Parce que nous ne partons pas pour la même destination. » Il fallait se rendre à l'évidence : c'était très mal écrit. Cette scène, ma scène de séparation, de rupture, était vraiment très mal écrite."},
  {id:97,ch:"C",text:"Les jours suivants, j'ai encore cherché, j'ai cherché longtemps une bonne réplique, une réplique qui percute, et rien, rien, plus rien ne venait."},
  {id:98,ch:"C",text:"Ça c'est une bonne réplique. Une très bonne réplique."},
];

/* ─────────────────────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────────────────────── */
function similarity(a, b) {
  a = a.toLowerCase().replace(/[^a-zàâäéèêëîïôùûüç\s]/g,"").trim();
  b = b.toLowerCase().replace(/[^a-zàâäéèêëîïôùûüç\s]/g,"").trim();
  if (a === b) return 1;
  const la=a.length, lb=b.length;
  if (!la||!lb) return 0;
  const dp=Array.from({length:la+1},(_,i)=>Array.from({length:lb+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=la;i++) for(let j=1;j<=lb;j++)
    dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return 1-dp[la][lb]/Math.max(la,lb);
}
function makeCloze(text, level=0.38) {
  const words=text.split(/\s+/);
  const blanks={};
  words.forEach((w,i)=>{
    const clean=w.replace(/[^a-zàâäéèêëîïôùûüç]/gi,"");
    if(clean.length>3&&Math.random()<level) blanks[i]=w;
  });
  return {words,blanks};
}

/* ─────────────────────────────────────────────────────────────────────────
   API CALLS — all via server functions
───────────────────────────────────────────────────────────────────────── */

// TTS via /api/tts
const audioCache={};
let currentAudio=null;
let stopTTSFlag=false;

async function speakLine(text, char, onEnd) {
  stopTTSFlag=false;
  if(currentAudio){currentAudio.pause();currentAudio=null;}
  const cacheKey=`${char.voiceId}:${text.slice(0,60)}`;
  let audioUrl=audioCache[cacheKey];
  if(!audioUrl){
    const res=await fetch("/api/tts",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        text,
        voiceId:char.voiceId,
        stability:char.stability,
        similarity:char.similarity,
        style:char.style,
      }),
    });
    if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||"TTS error");}
    const blob=await res.blob();
    audioUrl=URL.createObjectURL(blob);
    audioCache[cacheKey]=audioUrl;
  }
  if(stopTTSFlag){onEnd?.();return;}
  const audio=new Audio(audioUrl);
  currentAudio=audio;
  audio.onended=()=>{currentAudio=null;if(!stopTTSFlag)onEnd?.();};
  audio.onerror=()=>{currentAudio=null;onEnd?.();};
  audio.play();
}
function stopTTS(){stopTTSFlag=true;if(currentAudio){currentAudio.pause();currentAudio=null;}}

// STT via /api/stt (ElevenLabs Scribe)
async function transcribeAudio(blob) {
  const arrayBuffer=await blob.arrayBuffer();
  const base64=btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  const res=await fetch("/api/stt",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({audio:base64, mimeType:blob.type||"audio/webm"}),
  });
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||"STT error");}
  const data=await res.json();
  return data.text||"";
}

// Extract script from images/PDF via /api/extract (Gemini)
async function extractScript(files, characters) {
  const res=await fetch("/api/extract",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({files, characters}),
  });
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||"Extract error");}
  const data=await res.json();
  return data.lines||[];
}

// Convert file to base64
function fileToBase64(file){
  return new Promise((res,rej)=>{
    const reader=new FileReader();
    reader.onload=e=>res({
      base64:e.target.result.split(",")[1],
      mimeType:file.type,
      name:file.name,
    });
    reader.onerror=rej;
    reader.readAsDataURL(file);
  });
}

function getSupportedMime(){
  return ["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4","audio/wav"]
    .find(t=>MediaRecorder.isTypeSupported(t))||"";
}

/* ─────────────────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────────────────── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#f6f3ee;color:#1a1a1a;font-family:'Outfit',sans-serif;min-height:100vh}
.app{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:28px 16px 60px}
.mast{text-align:center;margin-bottom:4px}
.mast h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3rem);font-weight:600}
.mast .sub{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:#aaa;margin-top:3px}
.card{background:#fff;border:1px solid #e4dfd6;border-radius:14px;padding:26px;width:100%;max-width:660px;margin-top:20px;box-shadow:0 2px 18px rgba(0,0,0,.05)}
.lbl{font-size:.67rem;letter-spacing:.15em;text-transform:uppercase;color:#bbb;margin-bottom:8px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 22px;border-radius:8px;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:500;transition:all .16s;white-space:nowrap}
.btn:disabled{opacity:.35;cursor:not-allowed!important;transform:none!important}
.btn-dk{background:#1a1a1a;color:#fff}.btn-dk:not(:disabled):hover{background:#333;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.18)}
.btn-gh{background:transparent;color:#555;border:1px solid #d0cbc2}.btn-gh:not(:disabled):hover{background:#f5f2ed}
.btn-rd{background:#c0392b;color:#fff}.btn-rd:hover{background:#a93226}
.btn-gn{background:#1e8449;color:#fff}.btn-gn:hover{background:#196f3d}
.btn-sm{padding:7px 14px;font-size:.8rem}
.inp{width:100%;border:1px solid #d0cbc2;border-radius:8px;padding:11px 14px;font-family:'Outfit',sans-serif;font-size:.92rem;outline:none;transition:border .15s;background:#fff}
.inp:focus{border-color:#1a1a1a}
.inp-row{margin-bottom:14px}
.inp-row label{display:block;font-size:.75rem;font-weight:500;margin-bottom:5px;color:#555}
.char-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:10px;margin-top:14px}
.ctile{border-radius:10px;border:2px solid transparent;padding:14px 8px;cursor:pointer;text-align:center;transition:all .17s}
.ctile:hover{transform:translateY(-2px);box-shadow:0 5px 18px rgba(0,0,0,.1)}
.ctile.sel{border-color:currentColor}
.ci{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;line-height:1}
.cn{font-size:.78rem;font-weight:500;margin-top:5px}.cc{font-size:.67rem;color:#aaa;margin-top:2px}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:14px}
.mtile{border:1px solid #e0dad2;border-radius:10px;padding:17px 14px;cursor:pointer;transition:all .17s;text-align:left}
.mtile:hover{border-color:#1a1a1a;transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.08)}
.mico{font-size:1.6rem;margin-bottom:8px}.mtit{font-weight:600;font-size:.9rem}.mdsc{font-size:.74rem;color:#888;margin-top:3px;line-height:1.4}
.prow{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.pbar{height:3px;background:#ece7df;border-radius:2px;margin-bottom:18px;overflow:hidden}
.pfill{height:100%;background:#1a1a1a;border-radius:2px;transition:width .4s}
.ctx{background:#f8f5f0;border-radius:8px;padding:13px;margin-bottom:12px}
.cxl{padding:6px 0;border-bottom:1px solid #ede8e0;font-size:.86rem;line-height:1.55;display:flex;gap:8px;align-items:flex-start}
.cxl:last-child{border-bottom:none;padding-bottom:0}
.cxsp{font-weight:600;font-size:.67rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1px;flex-shrink:0;padding-top:2px}
.cxplay{background:none;border:none;cursor:pointer;opacity:.35;font-size:.85rem;padding:0 2px;flex-shrink:0;transition:opacity .15s}
.cxplay:hover{opacity:.9}
.cue{font-size:.72rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;margin-bottom:10px}
.sbar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#eaf2f8;border-radius:8px;margin-bottom:12px;font-size:.82rem;color:#1a5276}
.dots span{display:inline-block;width:5px;height:5px;background:#1a5276;border-radius:50%;margin:0 2px;animation:bop .85s infinite}
.dots span:nth-child(2){animation-delay:.18s}.dots span:nth-child(3){animation-delay:.36s}
@keyframes bop{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
.rarea{border:2px dashed #cec8bf;border-radius:10px;padding:22px 16px;text-align:center;margin:10px 0;transition:all .2s}
.rarea.on{border-color:#c0392b;background:#fdf6f5}
.pulse{width:13px;height:13px;background:#c0392b;border-radius:50%;display:inline-block;animation:pls 1.1s infinite}
@keyframes pls{0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,.35)}55%{box-shadow:0 0 0 9px rgba(192,57,43,0)}}
.rtimer{font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:#1a1a1a;margin:8px 0 4px}
.audio-player{background:#f8f5f0;border-radius:8px;padding:12px 14px;margin:10px 0}
.audio-player audio{width:100%;height:36px;outline:none;margin-top:6px}
.tbox{background:#f6f3ee;border-radius:7px;padding:11px 13px;font-size:.87rem;line-height:1.6;color:#333;min-height:42px;text-align:left}
.tbox-lbl{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:#aaa;display:block;margin-bottom:4px}
.wload{background:#fef9e7;border:1px solid #f0d060;border-radius:8px;padding:11px 14px;font-size:.83rem;color:#7a5c00;margin:10px 0;display:flex;align-items:center;gap:8px}
.spin{width:14px;height:14px;border:2px solid #f0d060;border-top-color:#7a5c00;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.fb{border-radius:8px;padding:13px 15px;margin-top:12px;font-size:.86rem;line-height:1.6}
.fb-ok{background:#eafaf1;border:1px solid #a9dfbf;color:#1a5e36}
.fb-warn{background:#fef9e7;border:1px solid #f0d060;color:#7a5c00}
.fb-err{background:#fdedec;border:1px solid #f0b0a8;color:#7b2020}
.fb-exp{font-style:italic;color:#666;margin-top:6px;font-size:.81rem;border-top:1px solid rgba(0,0,0,.06);padding-top:6px}
.cloze-wrap{font-size:.94rem;line-height:2.1}
.bl{border:none;border-bottom:2px solid #1a1a1a;background:transparent;font-family:'Outfit',sans-serif;font-size:.94rem;text-align:center;outline:none;padding:0 3px;min-width:52px;transition:border-color .18s}
.bl.bok{border-color:#1e8449}.bl.berr{border-color:#c0392b}
.warea{width:100%;border:1px solid #cec8bf;border-radius:8px;padding:12px;font-family:'Outfit',sans-serif;font-size:.92rem;line-height:1.65;resize:vertical;min-height:96px;outline:none;transition:border .15s}
.warea:focus{border-color:#1a1a1a}
.rev-block{border-radius:0 8px 8px 0;padding:14px 16px;font-size:.95rem;line-height:1.7}
.nav{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:14px}
.bk{font-size:.77rem;color:#bbb;cursor:pointer;text-decoration:underline}.bk:hover{color:#1a1a1a}
.sbadge{display:inline-flex;align-items:center;gap:4px;background:#f5f0e8;border-radius:20px;padding:3px 11px;font-size:.75rem;font-weight:500;color:#777}
.done-w{text-align:center;padding:30px 16px}
.bigp{font-family:'Cormorant Garamond',serif;font-size:5rem;font-weight:600;line-height:1}
.rply{background:none;border:none;cursor:pointer;opacity:.4;transition:opacity .14px;padding:3px 5px;font-size:.95rem;vertical-align:middle}
.rply:hover{opacity:1}
.err-banner{background:#fdedec;border:1px solid #f0b0a8;color:#7b2020;border-radius:8px;padding:10px 14px;font-size:.82rem;margin:8px 0;line-height:1.5}
.photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin:12px 0}
.photo-thumb{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;border:2px solid #e4dfd6}
.file-tag{display:inline-flex;align-items:center;gap:6px;background:#f5f0e8;border-radius:6px;padding:5px 10px;font-size:.78rem;margin:3px}
.file-tag button{background:none;border:none;cursor:pointer;color:#999;font-size:.85rem}
.step-num{width:28px;height:28px;border-radius:50%;background:#1a1a1a;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;flex-shrink:0;margin-top:2px}
.step-row{display:flex;gap:12px;align-items:flex-start;margin-bottom:20px}
.step-content{flex:1}
.upload-zone{border:2px dashed #cec8bf;border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:all .2s}
.upload-zone:hover{border-color:#1a1a1a;background:#f8f5f0}
@media(max-width:480px){.mgrid{grid-template-columns:1fr}.char-grid{grid-template-columns:repeat(3,1fr)}}
`;

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [screen,    setScreen]  = useState("home");
  const [script,    setScript]  = useState(GK_SCRIPT);
  const [chars,     setChars]   = useState(GK_CHARACTERS);
  const [chosen,    setChosen]  = useState(null);
  const [mode,      setMode]    = useState(null);
  const [idx,       setIdx]     = useState(0);
  const [feedback,  setFeed]    = useState(null);
  const [input,     setInput]   = useState("");
  const [score,     setScore]   = useState({ok:0,tot:0});
  const [cloze,     setCloze]   = useState(null);
  const [clozeA,    setClozeA]  = useState({});

  // Import state
  const [importChars, setIC]    = useState(DEFAULT_CHARACTERS.map(c=>({...c})));
  const [importFiles, setIF]    = useState([]); // [{base64, mimeType, name, url?}]
  const [importing,   setImp]   = useState(false);
  const [importErr,   setIErr]  = useState("");

  // Oral state
  const [oPhase,    setOP]      = useState("idle");
  const [speakErr,  setSErr]    = useState("");
  const [recSec,    setRecSec]  = useState(0);
  const [recBlob,   setRB]      = useState(null);
  const [recUrl,    setRU]      = useState(null);
  const [transcript,setTr]      = useState("");
  const [transErr,  setTE]      = useState("");
  const [transLoad, setTL]      = useState(false);

  const timerRef  = useRef(null);
  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);

  const getChar  = id => chars.find(c=>c.id===id);
  const myLines  = script.filter(l=>l.ch===chosen);

  useEffect(()=>()=>{stopTTS();},[]);

  function getCtx(line){
    const i=script.findIndex(l=>l.id===line.id);
    const ctx=[];
    for(let k=i-1;k>=0&&ctx.length<4;k--){
      if(script[k].ch!==chosen) ctx.unshift(script[k]);
      else break;
    }
    return ctx;
  }
  function resetOral(){setOP("idle");setSErr("");setRecSec(0);setRB(null);setRU(null);setTr("");setTE("");setTL(false);}

  function startMode(m){
    stopTTS();stopRec();
    setMode(m);setIdx(0);setFeed(null);setInput("");
    setScore({ok:0,tot:0});resetOral();
    if(m==="cloze"){setCloze(makeCloze(myLines[0]?.text||""));setClozeA({});}
    setScreen("play");
  }
  function next(){
    stopTTS();stopRec();
    const n=idx+1;
    if(n>=myLines.length){setScreen("done");return;}
    setIdx(n);setFeed(null);setInput("");resetOral();
    if(mode==="cloze"){setCloze(makeCloze(myLines[n].text));setClozeA({});}
  }

  /* ── TTS ── */
 async function playCtx(){
    const line=myLines[idx];if(!line)return;
    const ctx=getCtx(line);
    if(!ctx.length){setOP("waitRec");return;}
    setOP("speaking");setSErr("");
    
    for(let i=0;i<ctx.length;i++){
      if(stopTTSFlag) break;
      const l=ctx[i];
      try{
        await new Promise((res,rej)=>{
          speakLine(l.text,getChar(l.ch),res).catch(rej);
        });
        // Petite pause naturelle entre les répliques
        if(i<ctx.length-1) await new Promise(r=>setTimeout(r,300));
      }catch(e){
        setSErr("Voix : "+e.message);
        setOP("waitRec");
        return;
      }
    }
    if(!stopTTSFlag) setOP("waitRec");
  }
async function playSingle(text,charId){
    stopTTS();
    await new Promise(r=>setTimeout(r,100));
    try{await speakLine(text,getChar(charId),()=>{});}
    catch(e){setSErr("Voix : "+e.message);}
  }

  /* ── Recording ── */
  async function startRec(){
    setRecSec(0);setRB(null);setRU(null);setTr("");setTE("");setOP("recording");
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      chunksRef.current=[];
      const mime=getSupportedMime();
      const mr=new MediaRecorder(stream,mime?{mimeType:mime}:{});
      mediaRef.current=mr;
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.start(200);
      timerRef.current=setInterval(()=>setRecSec(s=>s+1),1000);
    }catch(e){setTE("Accès micro refusé.");setOP("waitRec");}
  }
  function stopRec(){
    if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
    if(mediaRef.current?.state!=="inactive"){
      try{mediaRef.current?.stop();}catch(e){}
      mediaRef.current?.stream?.getTracks().forEach(t=>t.stop());
    }
  }
  function finishRec(){
    stopRec();
    setTimeout(()=>{
      const mime=getSupportedMime()||"audio/webm";
      const blob=new Blob(chunksRef.current,{type:mime});
      setRB(blob);setRU(URL.createObjectURL(blob));setOP("recDone");
    },350);
  }
  async function runTranscription(){
    if(!recBlob)return;
    setTL(true);setTE("");
    try{const t=await transcribeAudio(recBlob);setTr(t);}
    catch(e){setTE("Transcription : "+e.message);}
    setTL(false);
  }
  function evalRec(){
    const exp=myLines[idx].text;
    const sim=similarity(transcript||"",exp);
    const ok=sim>0.68;
    setScore(s=>({ok:s.ok+(ok?1:0),tot:s.tot+1}));
    setFeed({ok,sim,expected:exp,got:transcript});
  }

  /* ── Cloze / Write ── */
  function checkCloze(){
    if(!cloze)return;
    let c=0;
    Object.entries(cloze.blanks).forEach(([i,w])=>{if(similarity(clozeA[i]||"",w)>0.78)c++;});
    const tot=Object.keys(cloze.blanks).length;
    setScore(s=>({ok:s.ok+(c===tot?1:0),tot:s.tot+1}));
    setFeed({ok:c===tot,correct:c,total:tot,expected:myLines[idx].text});
  }
  function checkWrite(){
    const exp=myLines[idx].text;
    const sim=similarity(input,exp);
    setScore(s=>({ok:s.ok+(sim>0.72?1:0),tot:s.tot+1}));
    setFeed({ok:sim>0.72,sim,expected:exp});
  }

  /* ── File import (photos + PDF) ── */
  async function handleFiles(e){
    const files=Array.from(e.target.files);
    const converted=await Promise.all(files.map(async f=>{
      const data=await fileToBase64(f);
      return {...data, url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null};
    }));
    setIF(prev=>[...prev,...converted]);
  }

  async function runImport(){
    if(!importFiles.length){setIErr("Ajoutez au moins un fichier.");return;}
    setImp(true);setIErr("");
    try{
      const lines=await extractScript(importFiles,importChars);
      setScript(lines.map((l,i)=>({...l,id:i+1})));
      setChars(importChars);
      setScreen("choose");
    }catch(e){setIErr("Erreur : "+e.message);}
    setImp(false);
  }

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const Mast=()=>(
    <div className="mast">
      <h1>Théâtre</h1>
      <p className="sub">Apprenez votre rôle</p>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     HOME
  ══════════════════════════════════════════════════════════════ */
  if(screen==="home") return(<><style>{CSS}</style>
    <div className="app"><Mast/>
      <div className="card">
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",marginBottom:14}}>Quel texte voulez-vous apprendre ?</h2>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="mtile" onClick={()=>{setScript(GK_SCRIPT);setChars(GK_CHARACTERS);setScreen("choose");}}>
            <div className="mico">📖</div>
            <div className="mtit">George Kaplan — Frédéric Sonntag</div>
            <div className="mdsc">Texte intégral déjà chargé, prêt à l'emploi</div>
          </div>
          <div className="mtile" onClick={()=>{setIF([]);setIErr("");setScreen("import");}}>
            <div className="mico">📷</div>
            <div className="mtit">Importer un nouveau texte</div>
            <div className="mdsc">Photos de pages ou fichier PDF — extraction automatique des répliques</div>
          </div>
        </div>
      </div>
    </div>
  </>);

  /* ══════════════════════════════════════════════════════════════
     IMPORT
  ══════════════════════════════════════════════════════════════ */
  if(screen==="import") return(<><style>{CSS}</style>
    <div className="app"><Mast/>
      <div className="card">
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",marginBottom:18}}>Importer votre texte</h2>

        {/* Step 1 — Characters */}
        <div className="step-row">
          <div className="step-num">1</div>
          <div className="step-content">
            <p style={{fontWeight:600,fontSize:".9rem",marginBottom:10}}>Nommez vos personnages</p>
            {importChars.map((ch,i)=>(
              <div key={ch.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:ch.bg,border:`2px solid ${ch.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".8rem",fontWeight:700,color:ch.color,flexShrink:0}}>{ch.id}</div>
                <input className="inp" style={{flex:"1 1 120px",minWidth:100}} placeholder={`Nom du personnage ${ch.id}`}
                  value={ch.name}
                  onChange={e=>setIC(cs=>cs.map((c,j)=>j===i?{...c,name:e.target.value}:c))}/>
                <select className="inp" style={{flex:"1 1 160px",minWidth:140,fontSize:".78rem"}}
                  value={ch.voiceId}
                  onChange={e=>setIC(cs=>cs.map((c,j)=>j===i?{...c,voiceId:e.target.value}:c))}>
                  {VOICE_IDS.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 — Files */}
        <div className="step-row">
          <div className="step-num">2</div>
          <div className="step-content">
            <p style={{fontWeight:600,fontSize:".9rem",marginBottom:6}}>Ajoutez vos fichiers</p>
            <p style={{fontSize:".78rem",color:"#888",marginBottom:12,lineHeight:1.5}}>
              Photos de pages (JPG, PNG) ou fichier PDF. Vous pouvez en ajouter plusieurs.
            </p>

            <label className="upload-zone">
              <div style={{fontSize:"2rem",marginBottom:8}}>📎</div>
              <div style={{fontWeight:500,fontSize:".9rem"}}>Cliquez pour ajouter</div>
              <div style={{fontSize:".75rem",color:"#aaa",marginTop:4}}>Photos ou PDF</div>
              <input type="file" accept="image/*,.pdf,application/pdf" multiple
                style={{display:"none"}} onChange={handleFiles}/>
            </label>

            {importFiles.length>0&&(
              <div style={{marginTop:12}}>
                {/* Image previews */}
                {importFiles.filter(f=>f.url).length>0&&(
                  <div className="photo-grid">
                    {importFiles.filter(f=>f.url).map((f,i)=>(
                      <div key={i} style={{position:"relative"}}>
                        <img src={f.url} className="photo-thumb" alt={f.name}/>
                        <button onClick={()=>setIF(fs=>fs.filter((_,j)=>j!==i))}
                          style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.6)",border:"none",color:"#fff",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:".7rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {/* PDF tags */}
                {importFiles.filter(f=>!f.url).map((f,i)=>(
                  <span key={i} className="file-tag">
                    📄 {f.name}
                    <button onClick={()=>setIF(fs=>fs.filter((_,j)=>j!==importFiles.findIndex(x=>x.name===f.name)))}>✕</button>
                  </span>
                ))}
                <p style={{fontSize:".74rem",color:"#aaa",marginTop:6}}>{importFiles.length} fichier(s)</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3 — Extract */}
        <div className="step-row">
          <div className="step-num">3</div>
          <div className="step-content">
            <p style={{fontWeight:600,fontSize:".9rem",marginBottom:6}}>Extraire les répliques</p>
            <p style={{fontSize:".78rem",color:"#888",marginBottom:10,lineHeight:1.5}}>
              Gemini va lire vos fichiers et extraire uniquement les répliques parlées, en ignorant didascalies et texte barré.
            </p>
            {importErr&&<div className="err-banner" style={{marginBottom:10}}>{importErr}</div>}
            {importing&&<div className="wload"><div className="spin"/><span>Analyse en cours…</span></div>}
            <button className="btn btn-dk" disabled={!importFiles.length||importing} onClick={runImport}>
              {importing?"Analyse…":"🧠 Extraire les répliques"}
            </button>
          </div>
        </div>

        <div className="nav"><span className="bk" onClick={()=>setScreen("home")}>← Retour</span></div>
      </div>
    </div>
  </>);

  /* ══════════════════════════════════════════════════════════════
     CHOOSE CHARACTER
  ══════════════════════════════════════════════════════════════ */
  if(screen==="choose") return(<><style>{CSS}</style>
    <div className="app"><Mast/>
      <div className="card">
        <p className="lbl">Choisissez votre personnage</p>
        <div className="char-grid">
          {chars.map(ch=>{
            const count=script.filter(l=>l.ch===ch.id).length;
            return(
              <div key={ch.id} className={`ctile${chosen===ch.id?" sel":""}`}
                style={{background:ch.bg,color:ch.color}} onClick={()=>setChosen(ch.id)}>
                <div className="ci">{ch.id}</div>
                <div className="cn">{ch.name}</div>
                <div className="cc">{count} répliques</div>
              </div>
            );
          })}
        </div>
        <div className="nav">
          <button className="btn btn-dk" disabled={!chosen} style={{flex:1}} onClick={()=>setScreen("mode")}>Continuer →</button>
          <span className="bk" onClick={()=>setScreen("home")}>← Textes</span>
        </div>
      </div>
    </div>
  </>);

  /* ══════════════════════════════════════════════════════════════
     CHOOSE MODE
  ══════════════════════════════════════════════════════════════ */
  if(screen==="mode"){
    const ch=getChar(chosen);
    return(<><style>{CSS}</style>
      <div className="app"><Mast/>
        <div className="card">
          <p className="lbl" style={{color:ch.color}}>Rôle : {ch.name} — {myLines.length} répliques</p>
          <div className="mgrid">
            {[
              {id:"oral", icon:"🎤",title:"Oral",          desc:"Voix naturelles + enregistrement + transcription automatique"},
              {id:"cloze",icon:"✏️",title:"Texte à trous",  desc:"Retrouvez les mots manquants"},
              {id:"write",icon:"📝",title:"Reconstitution", desc:"Réécrivez de mémoire"},
              {id:"review",icon:"👁️",title:"Lecture",       desc:"Parcourez vos répliques dans le contexte"},
            ].map(m=>(
              <div key={m.id} className="mtile" onClick={()=>startMode(m.id)}>
                <div className="mico">{m.icon}</div>
                <div className="mtit">{m.title}</div>
                <div className="mdsc">{m.desc}</div>
              </div>
            ))}
          </div>
          <div className="nav"><span className="bk" onClick={()=>setScreen("choose")}>← Personnages</span></div>
        </div>
      </div>
    </>);
  }

  /* ══════════════════════════════════════════════════════════════
     DONE
  ══════════════════════════════════════════════════════════════ */
  if(screen==="done"){
    const pct=score.tot>0?Math.round(score.ok/score.tot*100):null;
    return(<><style>{CSS}</style>
      <div className="app"><Mast/>
        <div className="card done-w">
          <div style={{fontSize:"3rem"}}>{pct===null?"🎭":pct>=80?"🏆":pct>=50?"💪":"📖"}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",marginTop:10}}>Exercice terminé !</h2>
          {pct!==null&&<>
            <div className="bigp" style={{color:pct>=75?"#1e8449":pct>=50?"#b7770d":"#b03a2e",margin:"14px 0 4px"}}>{pct}%</div>
            <p style={{color:"#888",fontSize:".86rem"}}>{score.ok}/{score.tot} répliques</p>
          </>}
          <div className="nav" style={{justifyContent:"center",marginTop:22}}>
            <button className="btn btn-dk" onClick={()=>startMode(mode)}>Recommencer</button>
            <button className="btn btn-gh" onClick={()=>setScreen("mode")}>Autre mode</button>
          </div>
        </div>
      </div>
    </>);
  }

  /* ══════════════════════════════════════════════════════════════
     PLAY
  ══════════════════════════════════════════════════════════════ */
  if(screen==="play"){
    const line=myLines[idx];if(!line)return null;
    const ch=getChar(chosen);
    const ctx=getCtx(line);
    const pct=(idx/myLines.length)*100;

    return(<><style>{CSS}</style>
      <div className="app"><Mast/>
        <div className="card">
          <div className="prow">
            <span className="lbl" style={{color:ch.color,margin:0}}>{ch.name} — {idx+1}/{myLines.length}</span>
            <span className="sbadge">✓ {score.ok}/{score.tot}</span>
          </div>
          <div className="pbar"><div className="pfill" style={{width:pct+"%"}}/></div>

          {ctx.length>0&&(
            <div className="ctx">
              <p className="lbl" style={{margin:"0 0 6px"}}>Contexte</p>
              {ctx.map(l=>{
                const lch=getChar(l.ch);
                return(
                  <div key={l.id} className="cxl">
                    <div style={{flex:1}}>
                      <div className="cxsp" style={{color:lch.color}}>{lch.name}</div>
                      <div>{l.text}</div>
                    </div>
                    <button className="cxplay" onClick={()=>playSingle(l.text,l.ch)}>🔊</button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="cue" style={{color:ch.color}}>🎭 {ch.name} — réplique {idx+1}</div>

          {/* ── ORAL ── */}
          {mode==="oral"&&(<>
            {speakErr&&<div className="err-banner">{speakErr}</div>}
            {oPhase==="idle"&&(
              <button className="btn btn-dk" style={{width:"100%"}} onClick={playCtx}>
                {ctx.length>0?"▶ Écouter le contexte":"▶ À mon tour"}
              </button>
            )}
            {oPhase==="speaking"&&(
              <div className="sbar">
                <div className="dots"><span/><span/><span/></div>
                Lecture en cours…
                <button className="btn btn-gh btn-sm" style={{marginLeft:"auto"}}
                  onClick={()=>{stopTTS();setOP("waitRec");}}>Passer</button>
              </div>
            )}
            {oPhase==="waitRec"&&!feedback&&(
              <div className="rarea">
                <p style={{fontSize:".84rem",color:"#888",marginBottom:14}}>À vous ! Dites votre réplique, puis appuyez sur Arrêter.</p>
                {transErr&&<p style={{fontSize:".8rem",color:"#b03a2e",marginBottom:10}}>{transErr}</p>}
                <button className="btn btn-dk" onClick={startRec}>🎤 Enregistrer</button>
              </div>
            )}
            {oPhase==="recording"&&(
              <div className="rarea on">
                <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:6}}>
                  <div className="pulse"/>
                  <span style={{fontWeight:500,color:"#c0392b"}}>Enregistrement…</span>
                </div>
                <div className="rtimer">{fmt(recSec)}</div>
                <button className="btn btn-rd" style={{marginTop:10}} onClick={finishRec}>⏹ Arrêter</button>
              </div>
            )}
            {oPhase==="recDone"&&!feedback&&(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {recUrl&&(
                  <div className="audio-player">
                    <span style={{fontSize:".72rem",letterSpacing:".08em",textTransform:"uppercase",color:"#aaa"}}>Votre enregistrement</span>
                    <audio src={recUrl} controls/>
                  </div>
                )}
                {transLoad&&<div className="wload"><div className="spin"/><span>Transcription en cours…</span></div>}
                {transcript&&!transLoad&&(
                  <div className="tbox"><span className="tbox-lbl">Transcription</span>{transcript}</div>
                )}
                {transErr&&<div className="err-banner">{transErr}</div>}
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {!transcript&&!transLoad&&(
                    <button className="btn btn-dk" onClick={runTranscription}>🧠 Transcrire</button>
                  )}
                  {transcript&&<button className="btn btn-gn" onClick={evalRec}>Évaluer</button>}
                  <button className="btn btn-gn" onClick={()=>setFeed({ok:null,sim:null,expected:myLines[idx].text,selfEval:true})}>
                    ✓ Auto-évaluer
                  </button>
                  <button className="btn btn-gh" onClick={()=>{resetOral();setOP("idle");}}>Réessayer</button>
                </div>
              </div>
            )}
            {feedback&&(<>
              {feedback.selfEval?(
                <div style={{background:"#f8f5f0",border:"1px solid #e0dad2",borderRadius:8,padding:"14px 15px",marginTop:8}}>
                  <p style={{fontWeight:600,marginBottom:8,fontSize:".9rem"}}>Texte attendu :</p>
                  <p style={{fontSize:".9rem",lineHeight:1.65,color:"#333"}}>{feedback.expected}</p>
                  <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                    <button className="btn btn-gn btn-sm" onClick={()=>{setScore(s=>({ok:s.ok+1,tot:s.tot+1}));next();}}>✓ Je l'avais</button>
                    <button className="btn btn-rd btn-sm" onClick={()=>{setScore(s=>({ok:s.ok,tot:s.tot+1}));next();}}>✗ Pas tout à fait</button>
                  </div>
                </div>
              ):(
                <div className={`fb ${feedback.ok?"fb-ok":feedback.sim>0.44?"fb-warn":"fb-err"}`}>
                  <strong>{feedback.ok?"✓ Excellent !":feedback.sim>0.44?"Presque !":"À retravailler"}</strong>
                  {feedback.sim!=null&&` (${Math.round(feedback.sim*100)}%)`}
                  {feedback.got&&<p className="fb-exp">Vous avez dit : « {feedback.got} »</p>}
                  <p className="fb-exp">Attendu : « {feedback.expected} »</p>
                </div>
              )}
              <button className="btn btn-gh btn-sm" style={{marginTop:8}}
                onClick={()=>playSingle(feedback.expected,chosen)}>🔊 Écouter la version correcte</button>
              {!feedback.selfEval&&(
                <div className="nav">
                  <button className="btn btn-dk" onClick={next} style={{flex:1}}>
                    {idx+1<myLines.length?"Réplique suivante →":"Terminer"}
                  </button>
                  <button className="btn btn-gh btn-sm" onClick={()=>{setFeed(null);resetOral();}}>Réessayer</button>
                </div>
              )}
            </>)}
          </>)}

          {/* ── CLOZE ── */}
          {mode==="cloze"&&cloze&&(<>
            <div className="cloze-wrap">
              {cloze.words.map((w,i)=>{
                if(cloze.blanks[i]!==undefined){
                  const ans=clozeA[i]||"";
                  const checked=!!feedback;
                  const ok=checked&&similarity(ans,cloze.blanks[i])>0.78;
                  return(<span key={i}><input className={`bl${checked?(ok?" bok":" berr"):""}`}
                    style={{width:Math.max(52,cloze.blanks[i].length*10)+"px"}}
                    value={ans} disabled={checked}
                    onChange={e=>setClozeA(a=>({...a,[i]:e.target.value}))}/>{" "}</span>);
                }
                return <span key={i}>{w} </span>;
              })}
            </div>
            {feedback&&(
              <div className={`fb ${feedback.ok?"fb-ok":"fb-warn"}`}>
                {feedback.ok?`✓ Parfait ! ${feedback.total}/${feedback.total}`:`${feedback.correct}/${feedback.total} mots corrects`}
                {!feedback.ok&&<p className="fb-exp">Texte : {feedback.expected}</p>}
              </div>
            )}
            <div className="nav">
              {!feedback
                ?<button className="btn btn-dk" onClick={checkCloze} style={{flex:1}}>Vérifier</button>
                :<button className="btn btn-dk" onClick={next} style={{flex:1}}>{idx+1<myLines.length?"Suivant →":"Terminer"}</button>}
            </div>
          </>)}

          {/* ── WRITE ── */}
          {mode==="write"&&(<>
            <textarea className="warea" value={input} onChange={e=>setInput(e.target.value)}
              placeholder="Écrivez votre réplique de mémoire…" disabled={!!feedback}/>
            {feedback&&(
              <div className={`fb ${feedback.ok?"fb-ok":feedback.sim>0.44?"fb-warn":"fb-err"}`}>
                <strong>{feedback.ok?"✓ Bravo !":feedback.sim>0.44?"Presque !":"À retravailler"}</strong>
                {" "}— {Math.round(feedback.sim*100)}%
                <p className="fb-exp">Attendu : {feedback.expected}</p>
              </div>
            )}
            <div className="nav">
              {!feedback
                ?<button className="btn btn-dk" disabled={!input.trim()} onClick={checkWrite} style={{flex:1}}>Vérifier</button>
                :<button className="btn btn-dk" onClick={next} style={{flex:1}}>{idx+1<myLines.length?"Suivant →":"Terminer"}</button>}
            </div>
          </>)}

          {/* ── REVIEW ── */}
          {mode==="review"&&(<>
            <div className="rev-block" style={{background:ch.bg,borderLeft:`3px solid ${ch.color}`}}>
              {line.text}
              <button className="rply" onClick={()=>playSingle(line.text,chosen)}>🔊</button>
            </div>
            <div className="nav">
              <button className="btn btn-dk" onClick={next} style={{flex:1}}>
                {idx+1<myLines.length?"Réplique suivante →":"Terminer"}
              </button>
            </div>
          </>)}

          <div className="nav" style={{marginTop:4}}>
            <span className="bk" onClick={()=>{stopTTS();stopRec();setScreen("mode");}}>← Mode</span>
          </div>
        </div>
      </div>
    </>);
  }
  return null;
}
