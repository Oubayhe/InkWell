
const randomImage = () => {
    const defaultImages = [
        "https://img.pikbest.com/backgrounds/20210314/abstract-flat-colorful-geometric-shapes-background_5804283.jpg!sw800",
        "https://static.vecteezy.com/system/resources/previews/011/124/884/non_2x/colorful-geometric-background-minimal-cover-template-design-for-web-modern-abstract-background-with-geometric-shapes-and-lines-vector.jpg",
        "https://img.freepik.com/free-vector/abstract-geometric-shapes-background_23-2148903828.jpg",
        "https://i0.wp.com/backgroundabstract.com/wp-content/uploads/edd/2022/02/6057300-e1656066696312.jpg?resize=1000%2C750&ssl=1",
        "https://i.pinimg.com/736x/4e/c3/fd/4ec3fd09ece034bec884cef1df66466d.jpg",
        "https://static.vecteezy.com/system/resources/previews/022/429/680/original/abstract-colorful-low-poly-geometric-shapes-background-png.png",
    ]
    
    indexItem = Math.floor(Math.random() * defaultImages.length)
    defaultImageURL = defaultImages[indexItem]
    return {url: defaultImageURL, caption: `dafault_image_${indexItem}`}
}


module.exports = randomImage
