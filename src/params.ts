import { defineParams } from '@sveltejs/kit/params';
import { QUESTION_PATH } from '#lib/fake-data.js';

export const params = defineParams({
	// /cual-es-la-mejor-aerolinea → "aerolinea". Cualquier otra cosa no calza.
	pregunta: (param) => QUESTION_PATH.exec(param)?.[1]
});
