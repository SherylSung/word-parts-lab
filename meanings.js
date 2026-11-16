const meanings = {
  'dis-':'not or the opposite', 'im-':'not', 'inter-':'between', 'kilo-':'one thousand',
  're-':'again or back', 'sub-':'under', 'tele-':'far away', 'un-':'not', 'under-':'below',
  '-able':'can be or able to be', '-al':'about or connected with',
  '-ation':'an action or its result', '-ative':'tending to do something',
  '-er':'a person or thing that does it', '-ful':'full of or having',
  '-hood':'a time or state of being', '-ian':'a person connected with it',
  '-ion':'an action or its result', '-ish':'like or having that quality',
  '-ist':'a person who does or studies it', '-ive':'having that quality',
  '-less':'without', '-ly':'in that way or having that quality',
  '-ment':'an action or its result', '-or':'a person or thing that does it',
  '-ous':'having that quality', '-ship':'a state or relationship', '-y':'having or full of',
  act:'do something', actual:'real or true', air:'what we breathe', appear:'come into sight',
  art:'making things such as pictures', back:'the part behind you', ball:'a round thing used in games',
  base:'a place to run to in baseball', basket:'a container for carrying things',
  bath:'washing your body in water', beauty:'what makes something nice to look at',
  bed:'a place to sleep', book:'pages you can read or write in', bow:'a curved shape',
  brush:'a tool for cleaning or painting', care:'attention to what you do',
  child:'a young person', class:'a group of students', cloud:'a white or gray shape in the sky',
  coat:'clothes you wear over other clothes', comfort:'a good, easy feeling', cut:'make shorter with a sharp tool',
  cycle:'go through the same steps again', danger:'a chance of getting hurt', day:'a period of 24 hours',
  drive:'control a car', earth:'the ground or land', educate:'teach someone', end:'the last part',
  farm:'grow food or keep animals', food:'things we eat', foot:'the body part you stand on',
  friend:'someone you like and know well', govern:'lead a country or area', gram:'a unit of weight',
  hair:'what grows on your head', happy:'feeling good or glad', hard:'with a lot of effort',
  help:'make things easier for someone', home:'the place where you live', honest:'telling the truth',
  inform:'tell someone something', invite:'ask someone to come', journal:'a paper or magazine with articles',
  line:'a long, thin mark', lone:'alone', love:'like someone or something very much',
  magic:'tricks that seem impossible', meter:'a unit for measuring length',
  move:'change place or position', music:'sounds people play or sing', nation:'a country',
  national:'about a country', nature:'the world of plants, animals, and land',
  near:'close', news:'reports of things that happened', note:'something you write to remember',
  pack:'a bag or bundle you can carry', pain:'a feeling that hurts', paint:'put color on something',
  paper:'what you write or print on', pass:'go through or by', peace:'a time with no fighting',
  person:'a human being', phone:'a tool for talking to someone far away', plane:'a thing with wings that flies',
  polite:'showing good manners', port:'a place where ships arrive or leave',
  possible:'able to happen', pot:'a container for cooking or holding liquid', print:'put words or pictures on paper',
  quake:'shake', rail:'a long bar that a train runs on', rain:'water that falls from clouds',
  real:'true or actually there', room:'a space inside a building', science:'the study of the world around us',
  sea:'a large body of salt water', self:'your own person', sing:'make music with your voice',
  skill:'being able to do something well', sleep:'rest with your eyes closed', snow:'soft white ice that falls from the sky',
  speak:'say words', storm:'very bad weather with wind or rain', sun:'the star that gives us light',
  talk:'say things to someone', tea:'a drink made with tea leaves', teach:'help someone learn',
  tooth:'a hard part in your mouth', turn:'change direction', use:'do something with a tool or thing',
  usual:'what normally happens', value:'how much something is worth', view:'look at or see',
  visit:'go to see a person or place', way:'a path or road', wear:'have clothes on',
  week:'seven days', wind:'moving air', wonder:'a feeling of surprise', work:'something you do',
  write:'put words on paper'
};

const specificMeanings = {
  'telephone': {phone:'sound or voice'},
  'airport': {port:'a place for planes to arrive or leave'},
  'hardly': {'-ly':'makes an adverb'},
  'lovely': {'-ly':'having that quality'},
  'lonely': {'-ly':'having that quality'},
  'nearly': {'-ly':'makes an adverb'}
};

Object.assign(meanings, {
  '-dom':'a state or place', '-ity':'a state or quality', '-like':'similar to',
  'bi-':'two', 'centi-':'one hundredth', 'in-':'not', 'mid-':'middle', 'tri-':'three',
  ache:'a pain that lasts', active:'doing things or moving around',
  advertise:'tell people about something for sale', after:'later than', angle:'the space between two meeting lines',
  any:'one or more of any kind', arm:'the part from shoulder to hand', begin:'start',
  birth:'the time when someone is born', black:'the darkest color', board:'a flat piece of wood or other material',
  body:'the whole physical part of a person', boy:'a male child', card:'a small piece of thick paper',
  case:'a box or container', cell:'a small area covered by a radio signal', center:'the middle',
  chair:'a seat for one person', classic:'well known and valued for a long time', color:'what makes things look red, blue, and so on',
  cow:'a large farm animal that gives milk', dependent:'needing help or support', dirt:'dust, soil, or other things that make something unclean',
  down:'toward a lower place', ear:'the body part you hear with', every:'each one in a group',
  fame:'being known by many people', fashion:'a popular style', father:'a male parent',
  flash:'a sudden bright light', fool:'someone who acts without thinking', free:'able to choose or act',
  grand:'one more step back in the family', head:'the top part of your body', health:'how well your body is',
  house:'a building people live in', king:'a man who rules a country', lead:'guide a group',
  light:'what helps you see', load:'move something onto a device or into a place', luck:'good or bad things that happen by chance',
  mail:'letters and things sent by post', man:'an adult male', mate:'a person you share an activity with',
  melon:'a large sweet fruit', mother:'a female parent', night:'the time when it is dark',
  no:'not any', noise:'a sound, often a loud one', noon:'twelve o’clock in the middle of the day',
  operate:'do surgery', play:'take part in a game', pollute:'make air, water, or land dirty',
  post:'the system for sending letters', rings:'round bands worn as jewelry', road:'a way for people or vehicles to travel',
  sales:'the work of selling things', side:'the part next to something', sneak:'do something without being seen',
  soft:'easy to press or bend', some:'one or more without saying which', stairs:'steps between floors',
  stomach:'the part of the body where food goes', store:'a shop', success:'getting the result you wanted',
  suit:'a set of clothes for an activity', swim:'move through water', thing:'an object or an idea',
  thirst:'a need to drink', tradition:'a way of doing things passed down over time', up:'toward a higher place',
  wait:'stay until something happens', walk:'go on foot', water:'a clear liquid we drink', where:'in or to a place'
});

Object.assign(specificMeanings, {
  anybody: {body:'a person'}, everybody: {body:'a person'}, nobody: {body:'a person'}, somebody: {body:'a person'},
  bicycle: {cycle:'a vehicle with wheels'}, worker: {work:'do a job'},
  waiter: {wait:'serve food or drinks at a table'}, sneaky: {'-y':'tending to do something'}
});

Object.assign(meanings, {
  '-ess':'a female person with that role or title',
  actor:'a person who acts in a play or movie',
  waiter:'a person who serves food at tables',
  prince:'a son of a king or queen'
});

Object.assign(meanings, {
  motor:'a machine that makes something move',
  scoot:'move quickly'
});
Object.assign(specificMeanings, {
  motorcycle:{cycle:'a vehicle with wheels'},
  scooter:{'-er':'a thing used to do something'}
});
