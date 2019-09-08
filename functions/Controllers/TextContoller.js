function procees(text){
    let ProcessedText = "";
    let SpecialCharacters = 0;

    for (i=0 ; i<text.length ; i++){
        if(text[i].toLowerCase().match(/[a-z]/i) || text[i] === ' ')
            ProcessedText += text[i];
        else
            SpecialCharacters+=1;
    }

    return {
        "text" : text,
        "ProcessedText" : ProcessedText ,
        "SpecialCharacters" : SpecialCharacters
    };
}

function NextFib(SpecialCharacters){
    n1 = 0;
    n2 = 1;
    if(!SpecialCharacters)
        return {"CharactersRemaining" : 1};
    for(i = 2 ;  ; i += n2){
        nextfib = n1 + n2;
        n1 = n2;
        n2 = nextfib;
        if(nextfib > SpecialCharacters)
            return {"CharactersRemaining" : nextfib - SpecialCharacters}
    }
}

async function result(text){
    const ProcessedText = await procees(text);
    const RemainingChars = await NextFib(ProcessedText.SpecialCharacters);

    return {ProcessedText , RemainingChars};
}

module.exports = {
    result: result
};