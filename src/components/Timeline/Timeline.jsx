import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import Popover from "../Popover/Popover";
import "./Timeline.css";

const Timeline = ({ items }) => {
	return (
		<div className="timeline-box">
			<div className="line-box">
				{items.map((item, index) => (
					<div key={index} className={`text-circle ${item.status}`}>
						<div className="circle">
							<h4>{item.title}</h4>
							<p>{item.date}</p>
						</div>
						{item.info && (
							<Popover title={item.info.title} content={item.info.content}>
								<button className="shape" aria-label="More info">
									<FaInfoCircle />
								</button>
							</Popover>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Timeline;
