export const NAME_REGEX = /^[A-Za-z0-9\w ]+$/;
export const NEW_NAME_REGEX = /^[A-Za-z ]+$/;
export const NUMBER_REGEX = /^[0-9\b.]+$/;
export const WHITE_SPACE_WITH_NAME_REGEX = /^[A-Za-z]+( [A-Za-z]+)*$/gi; ///^(.*\s.*){5,}$/;
export const WHITE_SPACE_WITH_LISTNAME_REGEX = /^[a-z0-9]+( [a-z0-9]+)*$/gi; ///^(.*\s.*){5,}$/;
export const ONLY_NUMBER_REGEX = /^[0-9]{0,2}$/;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
export const MEDIUM_PASSWORD_REGEX =
    /(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
export const WEBSITE_REGEX =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
export const PORTNUMBER_REGEX =
    /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;
export const IPADDRESS_REGEX =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const NUMBER_WITH_COMMA_REGEX = /\B(?=(\d{3})+(?!\d))/g;
export const CURRENCY_WITH_COMMA_REGEX = /(\d)(?=(\d{3})+\.)/g;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const ATLEAST_ONE_UPPERCASE = /[A-Z]/g; // capital letters from A to Z
export const ATLEAST_OE_LOWERCASE = /[a-z]/g; // small letters from a to z
export const ATLEAST_ONE_NUMBER = /[0-9]/g; // numbers from 0 to 9
export const ATLEAST_ONE_SPECIAL_CHARACTERS = /[#?!@$%^&*-]/g; // any of the special characters within the square brackets
export const CHARS_OR_MORE = /.{8,}/g; // eight characters or more
export const PERSONALIZE_REGEX = new RegExp(/\[\[\w*[A-Za-z0-9\s]*\]\]\|\[\[\w*[A-Za-z0-9\s]*\]\]/);
export const NEW_EMAIL_REGEX = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
export const PERCENTAGE = new RegExp(/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/, 'g');
export const COMMUNICATION_NAME = new RegExp(/[^a-zA-Z0-9-_ ]/, 'g');
export const FRIENDLY_NAME = new RegExp(/[^\w\s]/gi, '');
export const WEBURL_REGEX =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
//new RegExp(/^(ftp|www)?\.[^/s/$.?#]+\.[a-zA-Z]{2,}([^\s]*)?$/, 'g');
//
export const NO_SPECIAL_CHARS = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;
export const CREATE_NAME = new RegExp(/[^a-zA-Z0-9_ ]/, 'g'); //Allows only Small, capital, number and underscore characters
export const NAME_CREATION = new RegExp(/[ a-zA-Z0-9_-]/, 'g'); //Allows only Small, capital, number and underscore characters
export const LIST_NAME_CREATION = new RegExp(/^[ A-Za-z0-9_]{3,75}$/, 'g'); // Allows only Small, Capital, Number & (_-) Special Characters,Space allowed,
export const ALPHA_CHARCTERS = new RegExp(/[A-Za-z ]/, 'g'); // Allows A-Z , a-z and space
export const VALID_MOBILE_NUMBER = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/); // Allows only mobile numbers
export const UPDATED_EMAIL_ADDRESS = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/); // Valid Email Address. But, will ignore PARAMETERS
export const FRIENDLY_NAME_REGEX = new RegExp(/^([a-zA-Z0-9 _-]+)$/);
export const MIN_LENGTH = 3;
export const MAX_LENGTH = 75;
export const MAX_LENGTH50 = 50;
export const MAX_LENGTH100 = 100;
const EMOJI_REPRESENTATION =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
export const SMARTLINK_REGEX = new RegExp(
    /^(?:(?:https?|ftp):\/\/)?www\.([a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})+)(?:\?.*)?$/,
    'g',
);

