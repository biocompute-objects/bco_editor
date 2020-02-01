
export const onLink = (router, toLink='/') => () => {
  if (localStorage.formChanged === '1') {
    let result = window.confirm("You will be lost data. Please confirm.");
    if (result) {
      router.push(toLink)  
    }
  } else {
    router.push(toLink)
  }
}


export const setFormChanged = (value) => {
	localStorage.setItem('formChanged', value)
}

export const getFormChanged = () => {
	return localStorage.formChanged
}

export const setInitial = () => {
	setFormChanged(0);
	window.onbeforeunload = null;
	window.onhashchange = null;
}