export const docMask = (document) => {
  if(document) {
    let formatedDocument = document.replace(/\D/g,"");

    if(formatedDocument.length <= 11) {
      formatedDocument = formatedDocument.replace(/(\d{3})(\d)/,"$1.$2");
      formatedDocument = formatedDocument.replace(/(\d{3})(\d)/,"$1.$2");
      formatedDocument = formatedDocument.replace(/(\d{3})(\d{1,2})/,"$1-$2");
    } else if(formatedDocument.length <= 14) {
      formatedDocument = formatedDocument.replace(/(\d{2})(\d)/,"$1.$2");
      formatedDocument = formatedDocument.replace(/(\d{3})(\d)/,"$1.$2");
      formatedDocument = formatedDocument.replace(/(\d{3})(\d)/,"$1/$2");
      formatedDocument = formatedDocument.replace(/(\d{4})(\d{1,2})/,"$1-$2");
    } else {
      return document.slice(0, document.length-1);
    }

    return formatedDocument;
  } else {
    return '';
  }
}