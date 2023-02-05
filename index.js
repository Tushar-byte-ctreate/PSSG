const forword = document.getElementById('backFor')
const back = document.getElementById('backForw')
const lists = document.querySelector('.lists')
const graphBox = document.querySelector('.grapgBox')

forword.addEventListener('click',()=>{
    forword.style.display = 'none'
    lists.style.left= '-200px'
    back.style.marginLeft = '180px'
    back.style.display = 'block'
    graphBox.style.left = '-100px'
    
})
back.addEventListener('click',()=>{
    forword.style.display = 'block'
    lists.style.left= '0'
    back.style.marginLeft = '200px'
    back.style.display = 'none'
    graphBox.style.left = '0'
})

