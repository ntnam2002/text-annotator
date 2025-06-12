import "./App.css";
import HighlightDialog from "./components/Annotator";
import {
    exportHighlightsData,
    importHighlightsData,
} from "./components/Annotator/utils/ImportExportUtils";

function App() {
    const handleExportHighlights = () => {
        const data = exportHighlightsData();
        localStorage.setItem("highlightsData", JSON.stringify(data));
    };

    const handleImportHighlights = () => {
        if (localStorage.getItem("highlightsData")) {
            const importedData = JSON.parse(
                localStorage.getItem("highlightsData") || "{}",
            );
            importHighlightsData(importedData);
        } else {
            alert("Chưa có dữ liệu để import. Hãy export trước!");
        }
    };

    return (
        <HighlightDialog enableHighlight={true}>
            <div>
                <button
                    onClick={handleExportHighlights}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    Export Highlight
                </button>
                <button
                    onClick={handleImportHighlights}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginLeft: 10,
                    }}
                >
                    Import Highlight
                </button>
                <div>
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h1 style={{ color: "#2c3e50" }}>
                            IELTS Academic Reading Practice Test
                        </h1>
                        <div
                            style={{
                                marginBottom: "30px",
                                borderBottom: "1px solid #ddd",
                                paddingBottom: "20px",
                            }}
                        >
                            <h2 style={{ color: "#2c3e50" }}>
                                The Rise of Urban Cycling
                            </h2>

                            <p
                                style={{
                                    marginBottom: "1em",
                                    textAlign: "justify",
                                }}
                            >
                                <strong
                                    style={{
                                        fontWeight: "bold",
                                        display: "block",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    Paragraph A
                                </strong>
                                The bicycle, a seemingly simple two-wheeled
                                contraption, has been a catalyst for social
                                change and a steadfast mode of transport for
                                over a century. In recent decades, however, its
                                role has been evolving, particularly within
                                urban landscapes. Faced with mounting traffic
                                congestion, rising fuel prices, and growing
                                environmental concerns, cities worldwide are
                                witnessing a resurgence in cycling. This isn't
                                merely a return to a nostalgic past; it's a
                                forward-thinking response to the challenges of
                                modern urban living. Governments and urban
                                planners are increasingly recognizing the
                                bicycle's potential to alleviate pressure on
                                public transport systems, reduce air pollution,
                                and promote healthier lifestyles among citizens.
                            </p>

                            <p
                                style={{
                                    marginBottom: "1em",
                                    textAlign: "justify",
                                }}
                            >
                                <strong
                                    style={{
                                        fontWeight: "bold",
                                        display: "block",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    Paragraph B
                                </strong>
                                The benefits of urban cycling are manifold. From
                                an individual perspective, it offers a
                                cost-effective and often quicker way to navigate
                                congested city streets. Commuters can save
                                significant amounts on fuel, public transport
                                fares, and vehicle maintenance. Furthermore,
                                cycling is an excellent form of low-impact
                                exercise, easily integrated into daily routines,
                                contributing to improved cardiovascular health,
                                weight management, and reduced stress levels.
                                The sense of freedom and direct connection with
                                the urban environment is another often-cited
                                advantage by regular cyclists, fostering a
                                greater appreciation for their surroundings.
                            </p>

                            <p
                                style={{
                                    marginBottom: "1em",
                                    textAlign: "justify",
                                }}
                            >
                                <strong
                                    style={{
                                        fontWeight: "bold",
                                        display: "block",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    Paragraph C
                                </strong>
                                From a societal viewpoint, increased cycling
                                translates into tangible environmental and
                                economic advantages. Fewer cars on the road mean
                                reduced greenhouse gas emissions and improved
                                air quality, contributing to public health and a
                                more sustainable urban ecosystem. Economically,
                                investments in cycling infrastructure, such as
                                dedicated bike lanes and secure parking, are
                                significantly less expensive than those required
                                for road expansion or new public transport
                                lines. Moreover, vibrant cycling communities can
                                boost local economies by increasing foot traffic
                                to local businesses and fostering a more
                                attractive urban environment for residents and
                                tourists alike.
                            </p>

                            <p
                                style={{
                                    marginBottom: "1em",
                                    textAlign: "justify",
                                }}
                            >
                                <strong
                                    style={{
                                        fontWeight: "bold",
                                        display: "block",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    Paragraph D
                                </strong>
                                Despite these compelling advantages, the
                                widespread adoption of urban cycling faces
                                several hurdles. Safety concerns remain
                                paramount for many potential cyclists. The
                                perceived danger of sharing roads with
                                fast-moving vehicular traffic, coupled with a
                                lack of segregated cycling infrastructure in
                                many cities, acts as a significant deterrent.
                                Inclement weather conditions can also discourage
                                cycling, particularly in regions with harsh
                                winters or heavy rainfall. Furthermore, the
                                issue of bicycle theft is a persistent problem
                                that can dissuade individuals from investing in
                                a bicycle or using it regularly for commuting.
                            </p>

                            <p
                                style={{
                                    marginBottom: "1em",
                                    textAlign: "justify",
                                }}
                            >
                                <strong
                                    style={{
                                        fontWeight: "bold",
                                        display: "block",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    Paragraph E
                                </strong>
                                To overcome these challenges, a multi-faceted
                                approach is necessary. Cities that have
                                successfully promoted cycling, such as Amsterdam
                                and Copenhagen, have invested heavily in
                                comprehensive cycling networks, including
                                physically separated bike paths, bike-friendly
                                intersections, and ample secure bicycle parking.
                                Public awareness campaigns that highlight the
                                benefits of cycling and educate both cyclists
                                and motorists on road sharing etiquette are also
                                crucial. Additionally, integrating cycling with
                                public transport – for example, allowing
                                bicycles on trains and buses, or providing
                                bike-share systems near transport hubs – can
                                extend the reach and convenience of cycling for
                                longer commutes.
                            </p>

                            <p
                                style={{
                                    marginBottom: "1em",
                                    textAlign: "justify",
                                }}
                            >
                                <strong
                                    style={{
                                        fontWeight: "bold",
                                        display: "block",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    Paragraph F
                                </strong>
                                The future of urban cycling looks promising,
                                driven by technological advancements and
                                shifting societal values. E-bikes, or electric
                                bicycles, are making cycling more accessible to
                                a broader range of people, including older
                                adults and those with physical limitations, by
                                providing pedal assistance. Smart city
                                initiatives are incorporating data analytics to
                                optimize cycling routes and improve safety. As
                                cities continue to grow and grapple with the
                                complexities of sustainable development, the
                                humble bicycle is poised to play an increasingly
                                vital role in shaping healthier, greener, and
                                more liveable urban environments. The key lies
                                in sustained political will, community
                                engagement, and intelligent urban planning.
                            </p>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <h2 style={{ color: "#2c3e50" }}>Questions</h2>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    padding: "15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h3
                                    style={{
                                        color: "#2c3e50",
                                        marginTop: 0,
                                        borderBottom: "1px solid #ccc",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    Questions 1-5
                                </h3>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    The reading passage has six paragraphs,{" "}
                                    <strong>A-F</strong>.
                                </p>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Choose the correct heading for paragraphs{" "}
                                    <strong>B-F</strong> from the list of
                                    headings below.
                                </p>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Write the correct number (
                                    <strong>i-viii</strong>) in boxes 1-5 on
                                    your answer sheet.
                                </p>

                                <p
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    List of Headings
                                </p>
                                <ol
                                    type="i"
                                    style={{
                                        listStyleType: "lower-roman",
                                        marginLeft: "40px",
                                        paddingLeft: "20px",
                                    }}
                                >
                                    <li style={{ marginBottom: "5px" }}>
                                        Financial and health advantages for
                                        individuals
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        The ongoing problem of bicycle security
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        Addressing the obstacles to greater
                                        bicycle use
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        Positive effects on the city environment
                                        and economy
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        The increasing popularity of cycling in
                                        urban areas
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        Technological and societal trends
                                        boosting cycling's future
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        Difficulties posed by weather and
                                        traffic
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        Integrating cycling with other forms of
                                        transport
                                    </li>
                                </ol>
                                <br />
                                <p>
                                    <strong>1</strong> Paragraph B
                                </p>
                                <p>
                                    <strong>2</strong> Paragraph C
                                </p>
                                <p>
                                    <strong>3</strong> Paragraph D
                                </p>
                                <p>
                                    <strong>4</strong> Paragraph E
                                </p>
                                <p>
                                    <strong>5</strong> Paragraph F
                                </p>
                            </div>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    padding: "15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h3
                                    style={{
                                        color: "#2c3e50",
                                        marginTop: 0,
                                        borderBottom: "1px solid #ccc",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    Questions 6-9
                                </h3>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Do the following statements agree with the
                                    information given in the reading passage?
                                </p>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    In boxes 6-9 on your answer sheet, write
                                </p>
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        paddingLeft: "20px",
                                    }}
                                >
                                    <li style={{ marginBottom: "5px" }}>
                                        <strong>TRUE</strong> if the statement
                                        agrees with the information
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        <strong>FALSE</strong> if the statement
                                        contradicts the information
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        <strong>NOT GIVEN</strong> if there is
                                        no information on this
                                    </li>
                                </ul>
                                <br />
                                <p>
                                    <strong>6</strong> Cycling is primarily seen
                                    as a nostalgic activity by urban planners.
                                </p>
                                <p>
                                    <strong>7</strong> Building infrastructure
                                    for cycling is generally cheaper than for
                                    car-based transport.
                                </p>
                                <p>
                                    <strong>8</strong> Amsterdam and Copenhagen
                                    are the only cities that have successfully
                                    promoted cycling.
                                </p>
                                <p>
                                    <strong>9</strong> E-bikes are only suitable
                                    for older adults.
                                </p>
                            </div>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    padding: "15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h3
                                    style={{
                                        color: "#2c3e50",
                                        marginTop: 0,
                                        borderBottom: "1px solid #ccc",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    Questions 10-11
                                </h3>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Choose the correct letter,{" "}
                                    <strong>A, B, C</strong> or{" "}
                                    <strong>D</strong>.
                                </p>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Write the correct letter in boxes 10-11 on
                                    your answer sheet.
                                </p>
                                <br />
                                <p>
                                    <strong>10</strong> According to Paragraph
                                    B, what is one of the individual benefits of
                                    cycling?
                                </p>
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        paddingLeft: "20px",
                                    }}
                                >
                                    <li style={{ marginBottom: "5px" }}>
                                        A Increased social interaction with
                                        other commuters.
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        B Access to exclusive cycling clubs.
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        C Reduced stress levels.
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        D Opportunities for competitive racing.
                                    </li>
                                </ul>
                                <br />
                                <p>
                                    <strong>11</strong> What is a major
                                    deterrent mentioned in Paragraph D for
                                    potential cyclists?
                                </p>
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        paddingLeft: "20px",
                                    }}
                                >
                                    <li style={{ marginBottom: "5px" }}>
                                        A The high cost of purchasing a quality
                                        bicycle.
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        B Lack of scenic cycling routes in
                                        cities.
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        C The physical exertion required for
                                        long distances.
                                    </li>
                                    <li style={{ marginBottom: "5px" }}>
                                        D Fear of accidents involving other
                                        vehicles.
                                    </li>
                                </ul>
                            </div>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    padding: "15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h3
                                    style={{
                                        color: "#2c3e50",
                                        marginTop: 0,
                                        borderBottom: "1px solid #ccc",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    Questions 12-14
                                </h3>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Complete the sentences below.
                                </p>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Choose{" "}
                                    <strong>NO MORE THAN TWO WORDS</strong> from
                                    the passage for each answer.
                                </p>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    Write your answers in boxes 12-14 on your
                                    answer sheet.
                                </p>
                                <br />
                                <p>
                                    <strong>12</strong> Growing environmental
                                    concerns and high _________ are contributing
                                    to the cycling resurgence.
                                </p>
                                <p>
                                    <strong>13</strong> Successful cycling
                                    promotion often involves public awareness
                                    campaigns and educating both cyclists and
                                    _________.
                                </p>
                                <p>
                                    <strong>14</strong> Smart city initiatives
                                    use _________ to improve cycling routes and
                                    safety.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HighlightDialog>
    );
}

export default App;
