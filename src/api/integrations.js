const stub = (name) => async () => {
  console.warn(`${name}: not available in static mode`);
  return {};
};

export const Core = {};
export const InvokeLLM = stub('InvokeLLM');
export const SendEmail = stub('SendEmail');
export const UploadFile = async () => { console.warn('UploadFile: not available in static mode'); return { file_url: '' }; };
export const GenerateImage = stub('GenerateImage');
export const ExtractDataFromUploadedFile = stub('ExtractDataFromUploadedFile');
export const CreateFileSignedUrl = stub('CreateFileSignedUrl');
export const UploadPrivateFile = stub('UploadPrivateFile');
