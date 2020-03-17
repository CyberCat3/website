const LOAD_DEPENDENCY_LINE = "// BRING-IN ";

const loadedJsFiles = new Set();
const loadingJsFiles = new Set();
async function bringIn(scriptSource) {
    scriptSource = scriptSource.trim();

    // Don't load the js if we already have
    if (loadedJsFiles.has(scriptSource)) {
        console.log(`${scriptSource} already brought in.`);
        return;
    }

    // Don't load the js if we are already doing it
    if (loadingJsFiles.has(scriptSource)) {
        console.log(`${scriptSource} is already being brought in.`);
        return;
    }
    console.log(`Bringing in ${scriptSource}...`);

    loadingJsFiles.add(scriptSource);

    const dependencies = [];

    const scriptText = await (await fetch(scriptSource)).text();
    
    const lines = scriptText.split("\n");
    for (const line of lines) {
        if (line.startsWith(LOAD_DEPENDENCY_LINE)) {
            const dependency = line.substring(LOAD_DEPENDENCY_LINE.length);
            dependencies.push(dependency);
        } else {
            break;
        }
    } 

    if (dependencies.length > 0) {
        console.log(scriptSource + " has dependencies: ", dependencies);
    }


    await Promise.all(dependencies.map(bringIn));

    const script = document.createElement("script");
    script.src = scriptSource;
    document.head.appendChild(script);
    
    
    await new Promise((r) => script.onload = () => r());
    
    // document.head.removeChild(script);
    console.log(`Brought In ${scriptSource}`);

    loadingJsFiles.delete(scriptSource);
    loadedJsFiles.add(scriptSource);
}

bringIn("sketch.js").then(() => {
    document.querySelector(".loading_screen").style.height = "0vh";
    setTimeout(() => new p5(), 0);
});