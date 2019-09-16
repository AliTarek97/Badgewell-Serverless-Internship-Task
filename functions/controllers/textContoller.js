function process(text){
    let processedText = "";
    let specialCharacter = 0;

    for (i=0 ; i<text.length ; i++){
        if(text[i].toLowerCase().match(/[a-z]/i) || text[i] === ' ')
            processedText += text[i];
        else
            specialCharacter+=1;
    }

    return {
        "text" : text,
        "processedText" : processedText ,
        "specialCharacter" : specialCharacter
    };
}

function nextFib(specialCharacter){
    let first = 0;
    let second = 1;
    if(!specialCharacter)
        return {"CharactersRemaining" : 1};
    for(i = 2 ;  ; i += second){
        nextfib = first + second;
        first = second;
        second = nextfib;
        if(nextfib > specialCharacter)
            return {"CharactersRemaining" : nextfib - specialCharacter}
    }
}

async function result(text){
    const processedText = process(text);
    const remainingChars = nextFib(processedText.specialCharacter);

    return {processedText , remainingChars};
}

module.exports = {
    result: result
};