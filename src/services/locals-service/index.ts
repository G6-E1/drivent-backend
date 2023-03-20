import localsRepository from "@/repositories/locals-repository";

async function getLocals() {
  const locals = await localsRepository.findLocals();
  return locals;
}

const localsService = {
  getLocals,
};
  
export default localsService;
