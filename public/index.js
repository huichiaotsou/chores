const data = document.forms.namedItem('data');

data.addEventListener('submit', (e)=> {
    e.preventDefault();
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/submit');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const person = document.getElementById("name").value
                alert('輸入成功');

                window.location.assign(`rewards/${person}`)
            } else {
                alert('輸入失敗，請再試一次或跟惠喬哥哥說')
            }
        } 
    };
    
    const formData = new FormData(data);

    const today = new Date();
    const formatDate = today.getFullYear()+"-"+ parseInt(today.getMonth()+1) +"-"+ today.getDate()

    formData.append(date, formatDate)

    xhr.send(formData);
});