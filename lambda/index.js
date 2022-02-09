/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
//require de la libreria para el idioma
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

//frases en ingles y español
const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Hi! We will be playing ... In which movie happened? ... You will have to answer \
        the name of the movie in which happened what i am going to ask you. ... Lets start! ... ',
            CORRECT: 'Correct answer! ... ',
            INCORRECT: 'Wrong answer, the correct answer is ',
            REPEATING: '. ... Im repeating the question again. ... ',
            CLUE: 'Here goes a clue! ... ',
            YESORNO: 'Answer yes o no.',
            REPEAT: 'Lets repeat! ... ',
            CONTINUE: ' Shall we continue?',
            MAX_PENDING: 'You reached the maximum number of questions pending to be answered, lets go for it again. ... ',
            NEXT: 'We save this question for later, lets go with the next one! ... ',
            NO_PENDING: 'There are no pending questions! ... Would you like to continue with another question?',
            SAVING: 'We have left this one unanswered, we will retake it later ... ',
            RESCUING: 'Lets go for the pending question! ... ',
            HELP: 'The game consists on a number of questions that im going to ask you, and you will have to guess the movie title.',
            BYE: ' questions. ... Bye!',
            OF: ' out of ',
            MANAGED: 'You managed to get right ',
            FINISHED: 'You have answered all questions! ... ',
            NO_MORE: 'There are no new questions left, but one is pending, lets go for that one. ... ',
            TITLE: 'In which movie ',
            BECAUSE: ' because '
            
            
            
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: '¡Hola! Vamos a jugar a ... ¿En qué película pasó? ... Tendras que responder \
        diciendo qué película corresponde con el hito al que hago referencia. ... ¡Vamos a empezar! ...',
            CORRECT: 'Respuesta correcta! ... ',
            INCORRECT: 'Respuesta incorrecta, la respuesta correcta es ',
            REPEATING: '. ... Te vuelvo a repetir la pregunta. ... ',
            CLUE: 'Ahí va una pista! ... ',
            YESORNO: 'Responde Sí o No.',
            REPEAT: 'Repetimos! ... ',
            CONTINUE: 'Continuamos?',
            MAX_PENDING: 'Alcanzaste el máximo de preguntas pendientes de responder, vamos a por ella de nuevo. ... ',
            NEXT: 'Guardamos esta pregunta para después, vamos con la siguiente! ... There are no pending questions! ... Would you like to continue with another question?',
            NO_PENDING: 'No tienes preguntas pendientes! ... Quieres continuar con una nueva pregunta?',
            SAVING: 'Hemos dejado esta pregunta sin responder, la guardamos para después ... ',
            RESCUING: 'Vamos con la pregunta que teníamos pendiente! ... ',
            HELP: 'El juego consiste en que te iré haciendo preguntas y tendras que acertar la película ',
            BYE: ' preguntas. ... Hasta luego!',
            OF: ' de ',
            MANAGED: 'Has conseguido acertar ',
            FINISHED: 'Ya respondiste todas las preguntas! ... ',
            NO_MORE: 'Ya no te quedan más preguntas nuevas, pero sí te queda una pendiente, vamos con ella. ... ',
            TITLE: '¿En qué película ',
            BECAUSE: ' porque '
        }
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const questionText = getQuestion(handlerInput);
          currentStatus = 'Question';
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE') + questionText;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const AnswerValue = handlerInput.requestEnvelope.request.intent.slots.movieSlot.value;
        let lang = handlerInput.requestEnvelope.request.locale;
        let speechText = '';
        if(lang === 'en-US')
            speechText = currentIndex.en;
        else if(lang === ('es-ES' || 'es-MX' || 'es-US'))
            speechText = currentIndex.es;
            
        let speakOutput = '';
        
        if (currentStatus === 'Continue') {
            speakOutput += requestAttributes.t('YESORNO');
        }
        else {
            if (AnswerValue === speechText.name) {
                speakOutput += requestAttributes.t('CORRECT') + speechText.answer + '.';
                hits++;
            }
            else  {
                speakOutput += requestAttributes.t('INCORRECT') +  speechText.name + requestAttributes.t('BECAUSE') + speechText.answer + '.';
            }
        }
        currentIndex = null;
        speakOutput += requestAttributes.t('CONTINUE');
        currentStatus = 'Continue';
        
        if (exit) {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } 
        else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const speakOutput = getQuestion(handlerInput);
        currentStatus = 'Question';

        if (exit) {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
        } 
        else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    }
};


const ClueIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ClueIntent';
    },
    handle(handlerInput) {
        let lang = handlerInput.requestEnvelope.request.locale;
        let speechText = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let speakOutput = '';
        if(lang === 'en-US')
            speechText = currentIndex.en;
        else if(lang === ('es-ES' || 'es-MX' || 'es-US'))
            speechText = currentIndex.es;
            
        if (currentStatus === 'Question') {
            speakOutput += requestAttributes.t('CLUE') + speechText.clue + requestAttributes.t('REPEATING') + getQuestion(handlerInput, false);
        }
        else if (currentStatus === 'Continue') {
            speakOutput += requestAttributes.t('YESORNO');
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let speakOutput = '';
        if (currentStatus === 'Question') {
            speakOutput += requestAttributes.t('REPEAT') + getQuestion(handlerInput, false);
        }
        else if (currentStatus === 'Continue') {
            speakOutput += requestAttributes.t('CONTINUE');
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const NextIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let speakOutput = '';
        if (pending !== null) {
            speakOutput = requestAttributes.t('MAX_PENDING');
            const tmpIndex = currentIndex;
            currentIndex = pending;
            pending = tmpIndex;
            speakOutput += getQuestion(handlerInput, false);
        }
        else {
            speakOutput = requestAttributes.t('NEXT');
            pending = currentIndex;
            speakOutput += getQuestion(handlerInput);
        }
        currentStatus = 'Question';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const PendingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PendingIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let speakOutput = '';
        if (pending === null) {
            if (currentIndex !== null && currentStatus === 'Question') {
                speakOutput += requestAttributes.t('SAVING'); 
                pending = currentIndex;
            }
            speakOutput += requestAttributes.t('NO_PENDING');
            currentStatus = 'Continue';
        }
        else {
            if (currentIndex !== null && currentStatus === 'Question') {
                let tmpIndex = currentIndex;
                currentIndex = pending;
                pending = currentIndex;
                speakOutput += requestAttributes.t('SAVING'); 
            }
            else {
                currentIndex = pending;
                pending = null;
            }
            
            speakOutput += requestAttributes.t('RESCUING') + getQuestion(handlerInput, false);
            currentStatus = 'Question';
        }


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('MANAGED') + hits + requestAttributes.t('OF') + count + requestAttributes.t('BYE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//constante para importar la lista de preguntas
const questionsList = require('./question-list');

//variable para almacenar el indice de la pregunta
var currentIndex = null;

var currentStatus = null;

var count = 0;

var hits = 0;

var pending = null;

var exit = false;

//funcion para generar un indice aleatorio respecto a nuestra lista de preguntas
function getRandomItem(obj) {
    
    //si la lista es vacia
    if (Object.keys(obj).length === 0) {
        return null;
    }
    
    //si no es vacia, obten un indice aleatorio (y el objeto asociado a ese índice) dentro del rango del tamaño de la lista y devuelvelo
    currentIndex = obj[Object.keys(obj)[Math.floor(Math.random()*Object.keys(obj).length)]];
    return currentIndex;
}

//funcion para acceder a la informacion de una pregunta
function getQuestion(handlerInput, random = true) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    let speechText = '';
    let question = '';
    let lang = handlerInput.requestEnvelope.request.locale;
    if (random) {
        question = getRandomItem(questionsList);
        
        if(lang === 'en-US')
        speechText = question.en;
        else if(lang === ('es-ES' || 'es-MX' || 'es-US'))
        speechText = question.es;
        
        if (currentIndex === null && pending === null) {
            const speakOutput = requestAttributes.t('FINISHED') + hits + requestAttributes.t('OF') + count + requestAttributes.t('BYE');
            exit = true;
            return speakOutput;
        }
        else if (currentIndex === null) {
            return requestAttributes.t('NO_MORE') + requestAttributes.t('TITLE')+ speechText.question + '? ';
        }
        delete questionsList[speechText.id];
        count++;
    }
    else {
        if(lang === 'en-US')
        speechText = currentIndex.en;
        else if(lang === ('es-ES' || 'es-MX' || 'es-US'))
        speechText = currentIndex.es;
    }
    const speakOutput = requestAttributes.t('TITLE') + speechText.question + '? ';
    return speakOutput
}


//Interceptores para el idioma
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming Request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerIntentHandler,
        RepeatIntentHandler,
        NextIntentHandler,
        ClueIntentHandler,
        PendingIntentHandler,
        YesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();