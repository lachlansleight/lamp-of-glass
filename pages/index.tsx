import { useCallback, useEffect, useState } from "react";
import Layout from "components/layout/Layout";
import RenderCanvas from "components/layout/RenderCanvas";
import packageJson from "package.json";

const HomePage = (): JSX.Element => {
    const [lightness, setLightness] = useState(10);
    const [chroma, setChroma] = useState(10);
    const [hue, setHue] = useState(25);

    useEffect(() => {
        setLightness(Math.random() * 20 + 10);
        setChroma(Math.random() * 100);
        setHue(Math.random() * 360);
    }, []);

    const renderLightness = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < width; i++) {
                ctx.fillStyle = `oklch(${(100 * i) / width}%, ${chroma}%, ${hue}deg)`;
                ctx.fillRect(i, 0, 1, height);
            }
        },
        [chroma, hue]
    );

    const renderChroma = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < width; i++) {
                ctx.fillStyle = `oklch(${lightness}%, ${(100 * i) / width}%, ${hue}deg)`;
                ctx.fillRect(i, 0, 1, height);
            }
        },
        [lightness, hue]
    );

    const renderHue = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < width; i++) {
                ctx.fillStyle = `oklch(${lightness}%, ${chroma}%, ${(360 * i) / width}deg)`;
                ctx.fillRect(i, 0, 1, height);
            }
        },
        [lightness, chroma]
    );

    const [mousePos, setMousePos] = useState("");
    const [firstHover, setFirstHover] = useState(true);
    useEffect(() => {
        if (mousePos !== "") setFirstHover(false);
    }, [mousePos]);

    return (
        <Layout>
            <div
                className="h-full w-full grid place-items-center"
                style={{
                    backgroundColor: `oklch(${lightness}%, ${chroma}%, ${hue}deg)`,
                }}
            >
                <div
                    className={`flex flex-col gap-4 bg-neutral-800 rounded p-4 ${
                        firstHover ? "opacity-100" : "opacity-0"
                    } hover:opacity-100 transition-opacity`}
                    style={{
                        boxShadow: "0px 3px 5px 5px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <p className="text-white text-center font-mono -my-2 select-none">
                        Lamp v{packageJson.version}
                    </p>
                    <div
                        className="w-[300px] h-[20px] relative border border-black"
                        onMouseDown={() => setMousePos("lightness")}
                        onMouseUp={() => setMousePos("")}
                        onMouseMove={e => {
                            if (mousePos !== "lightness") return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            console.log(x);
                            setLightness((100 * x) / rect.width);
                        }}
                    >
                        <RenderCanvas className="w-full h-full" render={renderLightness} />
                        <div
                            className="absolute w-[8px] border border-white"
                            style={{
                                height: `calc(100% + 10px)`,
                                top: "-5px",
                                left: "calc(100% * " + lightness / 100 + " - 4px)",
                            }}
                        />
                    </div>
                    <div
                        className="w-[300px] h-[20px] relative border border-black"
                        onMouseDown={() => setMousePos("chroma")}
                        onMouseUp={() => setMousePos("")}
                        onMouseMove={e => {
                            if (mousePos !== "chroma") return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            console.log(x);
                            setChroma((100 * x) / rect.width);
                        }}
                    >
                        <RenderCanvas className="w-full h-full" render={renderChroma} />
                        <div
                            className="absolute w-[8px] border border-white"
                            style={{
                                height: `calc(100% + 10px)`,
                                top: "-5px",
                                left: "calc(100% * " + chroma / 100 + " - 4px)",
                            }}
                        />
                    </div>
                    <div
                        className="w-[300px] h-[20px] relative border border-black"
                        onMouseDown={() => setMousePos("hue")}
                        onMouseUp={() => setMousePos("")}
                        onMouseMove={e => {
                            if (mousePos !== "hue") return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            console.log(x);
                            setHue((360 * x) / rect.width);
                        }}
                    >
                        <RenderCanvas className="w-full h-full" render={renderHue} />
                        <div
                            className="absolute w-[8px] border border-white"
                            style={{
                                height: `calc(100% + 10px)`,
                                top: "-5px",
                                left: "calc(100% * " + hue / 360 + " - 4px)",
                            }}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
