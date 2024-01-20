import { Component } from "parvis";

export const Message = Component<{ text: string }>("Message", ({ props }) => {
    return () => {
        const { text } = props();
        const blocks = text.split(/\n\n+/);
        return (
            <p>
                {blocks.map((block) => {
                    const lines = block.split(/\n/);
                    return (
                        <>
                            <p>
                                {lines.map((line, i) => (
                                    <>
                                        {i > 0 && <br />}
                                        {line}
                                    </>
                                ))}
                            </p>
                            <br />
                        </>
                    );
                })}
            </p>
        );
    };
});
