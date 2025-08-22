const triggerTextToSpeech = async (text) => {
        try {
            //clientId
            const clientId = 1925;
            const departmentId = 2;
            const text = "Should I assist you with anything else?";
            const userId = 4581;
            const payload = { userId, clientId, departmentId, text };
            const result = await dispatch(getTextToSpeech(payload));
            const audioData = result?.data;
            if (audioData) {
                handleGenieAudio(audioData);
            } else {
                console.error('No audio data returned');
            }
        } catch (error) {
            console.error('Text-to-speech error:', error);
        }
    };

    let d = null;

    export const getTextToSpeech = (payload) => async (dispatch) => {
    return dispatch(
        request.post({
            url: 'Audience/GetgeneratevoiceGenie',
            payload,
            loading: false,
            ok: ({ data }) => {
                if (data) {
                    // dispatch(
                    //     updateAudio({
                    //         TTS: data,
                    //     }),
                    // );
                    d = data;
                 }// else {
                //     dispatch(updateAudio({}));
                // }
            },
            fail: (err) => console.log(err),
        }),
    );
};

console.log(triggerTextToSpeech("Do you want to filter based on engagement, such as website visits to loan pages?"));


