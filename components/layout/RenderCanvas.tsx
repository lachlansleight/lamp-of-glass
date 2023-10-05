import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import useElementDimensions from "lib/hooks/useElementDimensions";
import { useAnimationFrame } from "lib/hooks/useAnimationFrame";

const RenderCanvas = ({
    className = "",
    style = {},
    canvasConfig = {},
    render,
    onMousePosition,
}: {
    className?: string;
    style?: React.CSSProperties;
    canvasConfig?: Partial<React.CanvasHTMLAttributes<HTMLCanvasElement>>;
    render: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
    onMousePosition?: (x: number, y: number, u: number, v: number) => void;
}): JSX.Element => {
    const containerDiv = useRef<HTMLDivElement>(null);
    const size = useElementDimensions(containerDiv);
    const { width, height } = useMemo(() => {
        return {
            width: size.width * 2,
            height: size.height * 2,
        };
    }, [size]);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    useEffect(() => {
        if (!containerDiv.current) return;
        if (!canvas.current) return;
        canvas.current.width = width;
        canvas.current.height = height;
        setCtx(canvas.current.getContext("2d") as CanvasRenderingContext2D);
    }, [containerDiv, size, canvas, width, height]);
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ctx) return;
            if (!canvas.current) return;

            //get mouse position in px relative to canvas.current
            const rect = canvas.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            if (onMousePosition) onMousePosition(x * width, y * height, x, y);
        },
        [canvas, width, height]
    );

    useAnimationFrame(() => {
        if (!ctx) return;
        render(ctx, width, height);
    }, [render, width, height, ctx]);

    return (
        <div ref={containerDiv} className={`relative w-full ${className}`} style={style}>
            <canvas
                className="w-full h-full"
                ref={canvas}
                {...canvasConfig}
                onMouseMove={e => {
                    handleMouseMove(e);
                    canvasConfig.onMouseMove ? canvasConfig.onMouseMove(e) : null;
                }}
            />
        </div>
    );
};

export default RenderCanvas;
