import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "../entities/lib/projects";
import { ArrowUpRight } from "lucide-react";

type ModalProjectProps = {
	item: PortfolioItem | null;
	isOpen: boolean;
	onClose: () => void;
	t: (key: string) => string | undefined;
};

const MODAL_TITLE_ID = "modal-project-title";

export default function ModalProject({ item, isOpen, onClose, t }: ModalProjectProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const dialogRef = useRef<HTMLDivElement>(null);
	const triggerElementRef = useRef<Element | null>(null);

	useEffect(() => {
		if (isOpen) {
			triggerElementRef.current = document.activeElement;
			document.body.style.overflow = 'hidden';
			dialogRef.current?.focus();

			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					handleClose();
				}
			};

			document.addEventListener('keydown', handleEscape);
			return () => {
				document.body.style.overflow = 'unset';
				document.removeEventListener('keydown', handleEscape);
				setSelectedImageIndex(0);
				(triggerElementRef.current as HTMLElement | null)?.focus?.();
			};
		}
	}, [isOpen]);

	const handleClose = () => {
		onClose();
	};

	if (!isOpen || !item) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={handleClose}
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={MODAL_TITLE_ID}
				tabIndex={-1}
				className="relative bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col z-10 outline-none"
			>
				<div className="relative flex items-center justify-center p-5 border-b border-border">
					<h3 id={MODAL_TITLE_ID} className="text-2xl md:text-3xl font-semibold text-card-foreground text-center px-12 whitespace-pre-line">
						{t(item.titleKey)}
					</h3>
					<button
						onClick={handleClose}
						aria-label={t("general.close")}
						className="absolute right-6 h-11 w-11 grid place-items-center text-muted-foreground hover:text-card-foreground text-3xl font-bold cursor-pointer"
					>
						×
					</button>
				</div>

				<div className="flex-1 overflow-y-auto">
					<div className="p-6">
						{item.detailsKey && (
							<div className="mb-6">
								<p className="text-muted-foreground text-lg leading-relaxed mb-4">
									{t(item.detailsKey)}
								</p>
								{item.link && <div className="flex items-center justify-center">
									<a
										href={item.link}
										target="_blank"
										className="inline-flex items-center gap-2 text-accent hover:text-primary font-medium text-lg transition-all duration-300 hover:translate-x-1"
									>
										<span>{t("general.app")}</span>
										<ArrowUpRight className="w-5 h-5" />
									</a>
								</div>}
							</div>
						)}

						{item.note && <div className="mb-6 flex justify-center">
							<span className="px-3 py-1.5 text-sm font-medium text-accent bg-accent/10 border border-accent/20 rounded-full whitespace-pre-line">
								{t?.("projects.note")?.replace("{company}", item.company || "the company")}
							</span>
						</div>}
						<div className="mb-6 justify-center flex mt-4">
							<img
								src={item.captures[selectedImageIndex]}
								alt={item.alt || t(item.titleKey) || ""}
								className="rounded-lg shadow-md w-3/4"
							/>
						</div>

						{item.captures.length > 1 && (
							<div className="mb-8 flex justify-center">
								<div className="flex space-x-3 overflow-x-auto pb-2">
									{item.captures.map((imageUri, index) => (
										<button
											key={index}
											onClick={() => setSelectedImageIndex(index)}
											className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImageIndex === index
												? 'border-accent shadow-md'
												: 'border-border hover:border-muted-foreground'
												}`}
										>
											<img
												src={imageUri}
												alt={`${t(item.titleKey)} - Miniatura ${index + 1}`}
												className="w-full h-full object-cover"
											/>
										</button>
									))}
								</div>
							</div>
						)}

						{item.technologies && item.technologies.length > 0 && item.technologies.some(tech => tech.trim() !== "") && (
							<div className="mt-10">
								<span className="text-lg font-medium text-muted-foreground px-4 py-2 rounded-full">
									{t?.("projects.tecnologies")}
								</span>
								<div className="flex flex-wrap gap-4 justify-center mt-5 mb-5">
									{item.technologies.map((tech, index) => (
										tech.trim() && (
											<span
												key={index}
												className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full text-sm font-medium shadow-sm"
											>
												{tech}
											</span>
										)
									))}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="h-5" />
			</div>
		</div>
	);
}